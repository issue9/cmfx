// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package cmd 初始化命令行环境
package cmd

import (
	"flag"
	"fmt"
	"path/filepath"
	"time"

	xupload "github.com/issue9/upload/v3"
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
	"github.com/issue9/cmfx/cmfx/modules/member"
	"github.com/issue9/cmfx/cmfx/modules/system"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/user/passport/fido/passkey"
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
	uploadMod := root.New("upload", web.Phrase("upload module"))
	adminMod := root.New("admin", web.Phrase("admin module"), "admin")
	systemMod := root.New("system", web.Phrase("system module"))
	memberMod := root.New("member", web.Phrase("member module"), "member")

	// 指定上传模块
	const uploadPrefix = "/uploads"
	url, err := root.Router().URL(false, uploadPrefix, nil)
	if err != nil {
		return nil, err
	}
	uploadSaver, err := xupload.NewLocalSaver("./uploads", url, xupload.Day, func(dir, filename, ext string) string {
		return filepath.Join(dir, s.UniqueID()+ext) // filename 可能带非英文字符
	})
	if err != nil {
		return nil, err
	}
	uploadL := upload.Load(uploadMod, uploadPrefix, uploadSaver)

	switch action {
	case "serve":
		adminL := admin.Load(adminMod, user.Admin, uploadL)
		totp.Init(adminL.UserModule(), "totp", web.Phrase("TOTP passport"))
		passkey.Init(adminL.UserModule(), "webauthn", web.Phrase("webauthn passport"), time.Minute, "http://localhost:8080", "http://localhost:5173")

		member.Load(memberMod, user.Member, uploadL, adminL)

		system.Load(systemMod, user.System, adminL)

		// 在所有模块加载完成之后调用，需要等待其它模块里的私有错误代码加载完成。
		doc.WithDescription(nil, web.Phrase("problems response:\n\n%s\n", openapi.MarkdownProblems(s, 0)))
	case "install":
		adminL := admin.Install(adminMod, user.Admin, uploadL)
		totp.Install(adminL.UserModule().Module(), "totp")
		passkey.Install(adminL.UserModule().Module(), "webauthn")

		member.Install(memberMod, user.Member, uploadL, adminL, nil, nil)

		system.Install(systemMod, user.System, adminL)
	default:
		panic(fmt.Sprintf("invalid action %s", action))
	}
	return s, nil
}
