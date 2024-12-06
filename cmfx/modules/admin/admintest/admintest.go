// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admintest

import (
	"encoding/json"
	"net/http"
	"path/filepath"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	xupload "github.com/issue9/upload/v3"
	"github.com/issue9/web/server/config"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/user"
)

// NewModule 声明一个用于测试的 [admin.Module] 实例
func NewModule(s *test.Suite) *admin.Module {
	mod := s.NewModule("admin")

	o := &admin.Config{
		SuperUser: 1,
		User: &user.Config{
			URLPrefix:      "/admin",
			AccessExpired:  60 * config.Duration(time.Second),
			RefreshExpired: 120 * config.Duration(time.Second),
		},
		Upload: &upload.Config{
			Size:  1024 * 1024 * 1024,
			Exts:  []string{".jpg"},
			Field: "files",
		},
	}
	s.Assertion().NotError(o.SanitizeConfig())

	uploadSaver, err := xupload.NewLocalSaver("./uploads", "/uploads", xupload.Day, func(dir, filename, ext string) string {
		return filepath.Join(dir, s.Module().Server().ID()+ext) // filename 可能带非英文字符
	})
	s.Assertion().NotError(err).NotNil(uploadSaver)
	m := admin.Install(mod, o, upload.Load(s.NewModule("upload"), "/uploads", uploadSaver))
	s.Assertion().NotNil(m)

	return m
}

// GetToken 获得后台的访问令牌
func GetToken(s *test.Suite, m *admin.Module) string {
	r := &token.Response{}
	s.Post(m.URLPrefix()+"/passports/password/login", []byte(`{"username":"admin","password":"123"}`)).
		Header(header.ContentType, header.JSON+";charset=utf-8").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, r)) })

	return r.AccessToken
}
