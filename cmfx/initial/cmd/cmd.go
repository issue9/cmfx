// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package cmd 初始化命令行环境
package cmd

import (
	"flag"

	"github.com/issue9/upload/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"
	"github.com/issue9/webuse/v7/handlers/debug"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
)

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

	initial.Init(s, user.Ratelimit)

	router := s.Routers().New("default", nil,
		web.WithAllowedCORS(3600),
		web.WithURLDomain(user.URL),
		web.WithAnyInterceptor("any"), web.WithDigitInterceptor("digit"),
	)
	debug.RegisterDev(router, "/debug")

	db := user.DB.DB()
	s.OnClose(func() error { return db.Close() })

	var (
		adminMod  = cmfx.NewModule("admin", web.Phrase("admin"), s, db, router)
		systemMod = cmfx.NewModule("system", web.Phrase("system"), s, db, router)
	)

	uploadSaver, err := upload.NewLocalSaver("./upload", upload.Day, nil)
	if err != nil {
		return nil, err
	}

	switch action {
	case "serve":
		adminL := admin.Load(adminMod, user.Admin, uploadSaver)
		system.Load(systemMod, user.System, adminL)
	case "install":
		adminL := admin.Install(adminMod, user.Admin)
		system.Install(systemMod, user.System, adminL)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
	return s, nil
}
