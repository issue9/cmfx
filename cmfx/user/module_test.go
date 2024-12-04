// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user_test

import (
	"time"

	"github.com/issue9/web"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
)

var _ web.Middleware = &user.Module{}

// 声明 [Module] 变量
//
// 安装了注释库并提供一个 password 名称的密码验证功能
func NewModule(s *test.Suite) *user.Module {
	conf := &user.Config{
		URLPrefix:      "/user",
		AccessExpired:  60 * config.Duration(time.Second),
		RefreshExpired: 600 * config.Duration(time.Second),
	}
	s.Assertion().NotError(conf.SanitizeConfig())

	mod := s.NewModule("user")
	user.Install(mod)

	u := user.Load(mod, conf)
	s.Assertion().NotNil(u)

	uid, err := u.New(user.StateNormal, "user", "123")
	s.Assertion().NotError(err).NotZero(uid)

	return u
}
