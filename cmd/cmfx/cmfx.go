// SPDX-License-Identifier: MIT

package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/issue9/cmfx"
	"github.com/issue9/mux/v7"
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/app"
	"github.com/issue9/web/mode"

	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/pkg/user"

	_ "github.com/mattn/go-sqlite3"
)

type application = app.CLIOf[config]

type config struct {
	Admin *user.Config `yaml:"admin" xml:"admin" json:"admin"`
}

func (c *config) SanitizeConfig() *web.FieldError {
	return c.Admin.SanitizeConfig()
}

func main() {
	cmd := &application{
		Name:           "cmfx",
		Version:        cmfx.Version,
		Init:           initServer,
		ConfigDir:      "./",
		ConfigFilename: "web.xml",
		ServeActions:   []string{"serve"},
	}

	if err := cmd.Exec(os.Args); err != nil {
		fmt.Fprintf(cmd.Out, "%+v\n", err)
		os.Exit(2)
	}
}

func initServer(s *web.Server, user *config, action string) error {
	router := s.NewRouter("", nil,
		mux.URLDomain("https://localhost:8080/admin"),
		mux.AllowedCORS(3600), // TODO 转配置项？
		mux.Recovery(func(w http.ResponseWriter, a any) {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			s.Logs().ERROR().Println(a)
		}),
		mux.AnyInterceptor("any"), mux.DigitInterceptor("digit"),
	)

	mode.DebugRouter(router, "/debug", cmfx.BadRequestInvalidPath)

	cmfx.AddProblems(s)

	if err := s.LoadLocales(locales.Locales, "*.*"); err != nil {
		return err
	}

	db, err := orm.NewDB("./cmfx.db", dialect.Sqlite3("sqlite3"))
	if err != nil {
		return err
	}
	s.OnClose(func() error {
		return db.Close()
	})

	switch action {
	case "serve":
		return load(s, db, router, user.Admin)
	case "install":
		return install(s, db)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
}

func load(s *web.Server, db *orm.DB, router *web.Router, conf *user.Config) error {
	_, err := admin.New(cmfx.NewModule("admin", web.Phrase("admin"), s, db), router, conf)
	return err
}

func install(s *web.Server, db *orm.DB) error {
	admin.Install(cmfx.NewModule("admin", web.Phrase("admin"), s, db))
	return nil
}
