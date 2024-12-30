// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package membertest

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
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
	"github.com/issue9/cmfx/cmfx/modules/member"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/modules/upload/uploadtest"
	"github.com/issue9/cmfx/cmfx/user"
)

// NewModule 声明一个用于测试的 [member.Module] 实例
func NewModule(s *test.Suite) *member.Module {
	mod := s.NewModule("admin")

	o := &member.Config{
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

	m := member.Install(mod, o, uploadtest.NewModule(s, "mem_uploads"), admintest.NewModule(s))
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
