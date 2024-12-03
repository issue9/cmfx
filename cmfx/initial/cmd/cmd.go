// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package cmd 初始化命令行环境
package cmd

import (
	"flag"
	"path/filepath"

	"github.com/issue9/upload/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"
	"github.com/issue9/webuse/v7/handlers/debug"
	"github.com/issue9/webuse/v7/plugins/openapi/swagger"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
	"github.com/issue9/cmfx/cmfx/user/passport/otp/totp"
)

func Exec(id, version string) error {
	return app.NewCLI(&app.CLIOptions[*Config]{
		ID:             id,
		Version:        version,
		NewServer:      initServer,
		ConfigDir:      "./",
		ConfigFilename: "web.xml",
		ServeActions:   []string{"serve"},
		ErrorHandling:  flag.ExitOnError,
	}).Exec()
}

func initServer(id, ver string, o *server.Options, user *Config, action string) (web.Server, error) {
	s, err := server.NewHTTP(id, ver, o)
	if err != nil {
		return nil, err
	}

	cmfx.Init(s, user.Ratelimit, web.PluginFunc(swagger.Install))
	doc := test.NewDocument(s)

	router := s.Routers().New("default", nil,
		web.WithAllowedCORS(3600),
		web.WithURLDomain(user.URL),
		web.WithAnyInterceptor("any"), web.WithDigitInterceptor("digit"),
	)
	debug.RegisterDev(router, "/debug")
	router.Get("/openapi", doc.Handler())

	db := user.DB.DB()
	s.OnClose(func() error { return db.Close() })

	var (
		adminMod  = cmfx.NewModule("admin", web.Phrase("admin"), s, db, router, doc)
		systemMod = cmfx.NewModule("system", web.Phrase("system"), s, db, router, doc)
	)

	uploadSaver, err := upload.NewLocalSaver("./upload", user.URL+"/admin/upload", upload.Day, func(dir, filename, ext string) string {
		return filepath.Join(dir, s.UniqueID()+ext) // filename 可能带非英文字符
	})
	if err != nil {
		return nil, err
	}

	switch action {
	case "serve":
		adminL := admin.Load(adminMod, user.Admin, uploadSaver)
		totp.Init(adminL.UserModule(), "totp", web.Phrase("TOTP passport"))

		system.Load(systemMod, user.System, adminL)
	case "install":
		adminL := admin.Install(adminMod, user.Admin)
		totp.Install(adminL.UserModule().Module(), "totp")

		system.Install(systemMod, user.System, adminL)
	case "upgrade":
		panic("not implements")
	default:
		panic("invalid action")
	}
	return s, nil
}
