// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package usertest 提供简单的 user 包测试方法
package usertest

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web/server/config"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
)

// NewModule 声明一个用于测试的 [user.Module] 实例
//
// 提供了一个账号和密码分别为 u1 和 123 的测试数据。
func NewModule(s *test.Suite) *user.Module {
	mod := s.NewModule("user")

	user.Install(mod)

	o := &user.Config{
		URLPrefix:      "/user",
		AccessExpired:  config.Duration(time.Minute),
		RefreshExpired: config.Duration(2 * time.Minute),
	}
	s.Assertion().NotError(o.SanitizeConfig())

	m := user.Load(mod, o)
	s.Assertion().NotNil(m)

	_, err := m.New(user.StateNormal, "u1", "123", "", "", "add user")
	s.Assertion().NotError(err)
	return m
}

// GetToken 获得访问令牌
func GetToken(s *test.Suite, m *user.Module) string {
	r := &token.Response{}
	s.Post(m.URLPrefix()+"/passports/password/login", []byte(`{"username":"u1","password":"123"}`)).
		Header(header.ContentType, header.JSON+";charset=utf-8").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, r)) })

	return r.AccessToken
}
