// SPDX-License-Identifier: MIT

package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/issue9/cmfx"
	"github.com/issue9/logs/v4"
	"github.com/issue9/mux/v7"
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/app"

	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/modules/admin"
	c "github.com/issue9/cmfx/pkg/config"

	_ "github.com/mattn/go-sqlite3"
)

type application = app.AppOf[config]

type config struct {
	Admin *c.User `yaml:"admin" xml:"admin" json:"admin"`
}

func (c *config) SanitizeConfig() *app.ConfigError {
	return c.Admin.SanitizeConfig()
}

func main() {
	cmd := &application{
		Name:           "cmfx",
		Version:        cmfx.Version,
		Init:           initServer,
		ConfigFilename: "web.xml",
		ServeActions:   []string{"serve"},
	}

	if err := cmd.Exec(os.Args); err != nil {
		fmt.Fprintf(cmd.Out, "%+v\n", err)
		os.Exit(2)
	}
}

func initServer(s *web.Server, user *config, action string) error {
	router := s.Routers().New("", nil,
		mux.URLDomain("https://localhost:8080/admin"),
		mux.AllowedCORS(3600),
		mux.LogRecovery(http.StatusInternalServerError, s.Logs().StdLogger(logs.LevelError)),
		mux.AnyInterceptor("any"), mux.DigitInterceptor("digit"),
	)

	router.Any("/debug/{path}", func(ctx *web.Context) web.Responser {
		p, resp := ctx.ParamString("path", cmfx.BadRequestInvalidParam)
		if resp != nil {
			return resp
		}

		if err := mux.Debug(p, ctx, ctx.Request()); err != nil {
			return ctx.InternalServerError(err)
		}
		return nil
	})

	cmfx.AddProblems(s.Problems())

	if err := s.LoadLocale(locales.Locales, "*.*"); err != nil {
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
		defer db.Close()
		return install(s, db)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
}

func load(s *web.Server, db *orm.DB, router *web.Router, conf *c.User) error {
	_, err := admin.New("admin", s, db, router, conf)
	return err
}

func install(s *web.Server, db *orm.DB) error {
	admin.Install(s, "admin", db)
	return nil
}
