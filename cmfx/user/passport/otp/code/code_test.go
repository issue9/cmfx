// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"net/http"
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport/otp/code/codetest"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

var _ user.Passport = &code{}

func TestCode(t *testing.T) {
	a := assert.New(t, false)

	suite := test.NewSuite(a)
	defer suite.Close()
	sender := codetest.New()

	u := usertest.NewModule(suite)
	Install(u.Module(), "code")
	p := Init(u, time.Minute, time.Second, nil, sender, "code", func(*user.User) error { return nil }, web.Phrase("code"))

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	u1, err := u.GetUserByUsername("u1")
	a.NotError(err).NotNil(u1)

	identity, state := p.Identity(u1.ID)
	a.Equal(state, -1).Empty(identity)

	// 未注册，登录不了
	suite.Post("/user/passports/code/login", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Body([]byte(`{"target":"u1","code":"123"}`)).
		Do(nil).
		Status(http.StatusUnauthorized)

	tk := usertest.GetToken(suite, u)

	suite.Post("/user/passports/code/login/code", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk)).
		Body([]byte(`{"target":"u2"}`)).
		Do(nil).
		Status(http.StatusCreated)
	a.Equal(sender.Target, "u2").NotEmpty(sender.Code)

	// 登录操作，错误的账号和验证码
	suite.Post("/user/passports/code/login", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk)).
		Body([]byte(`{"target":"u1","code":"` + sender.Code + `"}`)).
		Do(nil).
		Status(http.StatusUnauthorized)

	// 正常登录操作
	suite.Post("/user/passports/code/login", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk)).
		Body([]byte(`{"target":"u2","code":"` + sender.Code + `"}`)).
		Do(nil).
		Status(http.StatusCreated)
}
