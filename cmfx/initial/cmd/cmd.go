// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package cmd 初始化命令行环境
package cmd

import (
	"flag"
	"net/smtp"
	"path/filepath"
	"time"

	"github.com/issue9/upload/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/cbor"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/mimetype/yaml"
	"github.com/issue9/web/openapi"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"
	"github.com/issue9/webuse/v7/handlers/debug"
	"github.com/issue9/webuse/v7/plugins/openapi/swagger"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
	"github.com/issue9/cmfx/cmfx/user/passport/code"
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

	initial.Init(s, user.Ratelimit, web.PluginFunc(swagger.Install))

	doc := openapi.New(s, web.Phrase("The api doc of %s", s.Name()),
		openapi.WithMediaType(json.Mimetype, yaml.Mimetype, cbor.Mimetype),
		openapi.WithResponse(&openapi.Response{
			Ref:  &openapi.Ref{Ref: "empty"},
			Body: &openapi.Schema{Type: openapi.TypeObject},
		}),
		openapi.WithProblemResponse(),
		openapi.WithContact("caixw", "", "https://github.com/caixw"),
		swagger.WithCDN(""),
	)

	router := s.Routers().New("default", nil,
		web.WithAllowedCORS(3600),
		web.WithURLDomain(user.URL),
		web.WithAnyInterceptor("any"), web.WithDigitInterceptor("digit"),
	)
	debug.RegisterDev(router, "/debug")
	router.Get("/openapi", doc.Handler)

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
		smtpAuth := smtp.PlainAuth("id", "username", "password", "smtp@example.com")
		smtpAdpater := code.New(adminL.Module(), 5*time.Minute, "smtp", code.NewSMTPSender("code", "smtp@example.com", "server@example.com", "%%code%%", smtpAuth))
		adminL.Passport().Register("smtp", smtpAdpater, web.Phrase("smtp valid"))

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
