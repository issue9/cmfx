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
	"github.com/issue9/web/mimetype/cbor"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/openapi"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/app"
	"github.com/issue9/webuse/v7/handlers/debug"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	"github.com/issue9/webuse/v7/middlewares/auth/token"
	"github.com/issue9/webuse/v7/plugins/openapi/swagger"

	"github.com/issue9/cmfx/cmfx"
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

	c := web.NewCache(user.Ratelimit.Prefix, s.Cache())
	limit := ratelimit.New(c, user.Ratelimit.Capacity, user.Ratelimit.Rate.Duration(), nil)

	router := s.Routers().New("main", nil,
		web.WithAnyInterceptor("any"),
		web.WithDigitInterceptor("digit"),
	)
	debug.RegisterDev(router, "/debug")

	doc := openapi.New(s, web.Phrase("The api doc of %s", s.ID()),
		openapi.WithMediaType(json.Mimetype, cbor.Mimetype),
		openapi.WithProblemResponse(),
		openapi.WithContact("caixw", "", "https://github.com/caixw"),
		openapi.WithSecurityScheme(token.SecurityScheme("token", web.Phrase("token auth"))),
		cmfx.WithTags(),
		swagger.WithCDN(""),
	)
	s.Use(web.PluginFunc(swagger.Install))
	router.Get("/openapi", doc.Handler())

	root := cmfx.Init(s, limit, user.DB.DB(), router, doc)
	adminMod := root.New("admin", web.Phrase("admin"), "admin")
	systemMod := root.New("system", web.Phrase("system"))

	switch action {
	case "serve":
		url, err := root.Router().URL(false, user.Admin.User.URLPrefix+"/upload", nil)
		if err != nil {
			return nil, err
		}
		uploadSaver, err := upload.NewLocalSaver("./upload", url, upload.Day, func(dir, filename, ext string) string {
			return filepath.Join(dir, s.UniqueID()+ext) // filename 可能带非英文字符
		})
		if err != nil {
			return nil, err
		}
		adminL := admin.Load(adminMod, user.Admin, uploadSaver)
		totp.Init(adminL.UserModule(), "totp", web.Phrase("TOTP passport"))

		system.Load(systemMod, user.System, adminL)

		// 在所有模块加载完成之后调用，需要等待其它模块里的私有错误代码加载完成。
		doc.WithDescription(nil, web.Phrase("problems response:\n\n%s\n", openapi.MarkdownProblems(s, 0)))
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
