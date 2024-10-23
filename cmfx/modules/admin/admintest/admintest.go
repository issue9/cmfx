// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admintest

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web/server/config"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
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
		Upload: &admin.Upload{
			Size:  1024 * 1024 * 1024,
			Exts:  []string{".jpg"},
			Field: "files",
		},
	}
	s.Assertion().NotError(o.SanitizeConfig())

	loader := admin.Install(mod, o)
	s.Assertion().NotNil(loader)

	return loader
}

// GetToken 获得后台的访问令牌
func GetToken(s *test.Suite, loader *admin.Module) string {
	r := &token.Response{}
	s.Post(loader.URLPrefix()+"/login?type=password", []byte(`{"username":"admin","password":"123"}`)).
		Header(header.ContentType, header.JSON+";charset=utf-8").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, r)) })

	return r.AccessToken
}
