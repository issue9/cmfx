// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/passport/password"
)

var _ web.Middleware = &Module{}

// 声明 [Module] 变量
//
// 安装了注释库并提供一个 password 名称的密码验证功能
func newLoader(s *test.Suite) *Module {
	conf := &Config{
		URLPrefix:      "/user",
		AccessExpired:  60,
		RefreshExpired: 600,
	}
	s.Assertion().NotError(conf.SanitizeConfig())

	mod := s.NewModule("user")
	Install(mod)
	password.Install(mod)

	u := Load(mod, conf)
	s.Assertion().NotNil(u)

	u.Passport().Register("password", password.New(u.Module(), 9), web.Phrase("password"))
	p := u.Passport().Get("password")
	uid, err := u.NewUser(p, "admin", "password", time.Now())
	s.Assertion().NotError(err).NotZero(uid)

	return u
}
