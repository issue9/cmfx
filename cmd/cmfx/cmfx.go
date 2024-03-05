// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/issue9/cmfx"
	"github.com/issue9/mux/v7"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
	"github.com/issue9/web/comptime"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"

	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/pkg/db"
	"github.com/issue9/cmfx/pkg/user"

	_ "github.com/mattn/go-sqlite3"
)

type application = app.CLI[config]

type config struct {
	DB    *db.Config   `yaml:"db" xml:"db" json:"db"`
	Admin *user.Config `yaml:"admin" xml:"admin" json:"admin"`
}

func (c *config) SanitizeConfig() *web.FieldError {
	if err := c.DB.SanitizeConfig(); err != nil {
		return err
	}
	return c.Admin.SanitizeConfig()
}

func main() {
	cmd := &application{
		Name:           "cmfx",
		Version:        cmfx.Version,
		NewServer:      initServer,
		ConfigDir:      "./",
		ConfigFilename: "web.xml",
		ServeActions:   []string{"serve"},
	}

	if err := cmd.Exec(os.Args); err != nil {
		fmt.Fprintf(cmd.Out, "%+v\n", err)
		os.Exit(2)
	}
}

func initServer(name, ver string, o *server.Options, user *config, action string) (web.Server, error) {
	s, err := server.New(name, ver, o)
	if err != nil {
		return nil, err
	}

	router := s.Routers().New("", nil,
		mux.URLDomain("https://localhost:8080/admin"),
		mux.AllowedCORS(3600),
		mux.Recovery(func(w http.ResponseWriter, a any) {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
			s.Logs().ERROR().Print(a)
		}),
		mux.AnyInterceptor("any"), mux.DigitInterceptor("digit"),
	)

	comptime.DebugRouter(router, "/debug", cmfx.BadRequestInvalidPath)

	cmfx.AddProblems(s)

	if err := s.Locale().LoadMessages("*.*", locales.All...); err != nil {
		return nil, err
	}

	db := user.DB.DB()
	s.OnClose(func() error {
		return db.Close()
	})

	switch action {
	case "serve":
		return s, load(s, db, router, user.Admin)
	case "install":
		return s, install(s, db, router)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
}

func load(s web.Server, db *orm.DB, router *web.Router, conf *user.Config) error {
	_, err := admin.New(cmfx.NewModule("admin", web.Phrase("admin"), s, db, router), conf)
	return err
}

func install(s web.Server, db *orm.DB, router *web.Router) error {
	admin.Install(cmfx.NewModule("admin", web.Phrase("admin"), s, db, router))
	return nil
}
