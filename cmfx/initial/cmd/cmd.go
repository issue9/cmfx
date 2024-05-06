// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package cmd 初始化命令行环境
package cmd

import (
	"flag"

	"github.com/issue9/mux/v8"
	"github.com/issue9/web"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"
	"github.com/issue9/webuse/v7/handlers/debug"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
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

	initial.Init(s)

	router := s.Routers().New("", nil,
		web.URLDomain(user.URL),
		mux.AnyInterceptor("any"), mux.DigitInterceptor("digit"),
	)
	debug.RegisterDev(router, "/debug")

	db := user.DB.DB()
	s.OnClose(func() error { return db.Close() })

	var (
		adminMod  = cmfx.NewModule("admin", web.Phrase("admin"), s, db, router)
		systemMod = cmfx.NewModule("system", web.Phrase("system"), s, db, router)
	)

	switch action {
	case "serve":
		adminL := admin.Load(adminMod, user.Admin)
		system.Load(systemMod, user.System, adminL)
	case "install":
		admin.Install(adminMod)
		system.Install(systemMod)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
	return s, nil
}
