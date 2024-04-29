// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package cmd 初始化命令行环境
package cmd

import (
	"flag"

	"github.com/issue9/mux/v8"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"
	"github.com/issue9/webuse/v7/handlers/debug"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/inital"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/user"
)

// Exec 执行服务
func Exec(name, version string) error {
	return app.NewCLI(&app.CLIOptions[*Config]{
		Name:           name,
		Version:        version,
		NewServer:      initServer,
		ConfigDir:      "./",
		ConfigFilename: "web.xml",
		ServeActions:   []string{"serve"},
		ErrorHandling:  flag.ExitOnError,
	}).Exec()
}

func initServer(name, ver string, o *server.Options, user *Config, action string) (web.Server, error) {
	s, err := server.NewHTTP(name, ver, o)
	if err != nil {
		return nil, err
	}

	inital.Init(s)

	router := s.Routers().New("", nil,
		web.URLDomain(user.URL),
		mux.AnyInterceptor("any"), mux.DigitInterceptor("digit"),
	)
	debug.RegisterDev(router, "/debug")

	db := user.DB.DB()
	s.OnClose(func() error { return db.Close() })

	switch action {
	case "serve":
		return s, load(s, db, router, user.Admin)
	case "install":
		return s, install(s, db, router, user)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
}

func load(s web.Server, db *orm.DB, router *web.Router, conf *user.Config) error {
	admin.Load(cmfx.NewModule("admin", web.Phrase("admin"), s, db, router), conf)
	return nil
}

func install(s web.Server, db *orm.DB, router *web.Router, conf *Config) error {
	admin.Install(cmfx.NewModule("admin", web.Phrase("admin"), s, db, router))
	return nil
}
