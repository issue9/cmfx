// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package totp

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

var _ user.Passport = &totp{}

func TestTOTP(t *testing.T) {
	a := assert.New(t, false)

	suite := test.NewSuite(a)
	defer suite.Close()

	u := usertest.NewModule(suite)
	Install(u.Module(), "totp")
	p := Init(u, "totp", web.Phrase("totp"))

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	u1, err := u.GetUserByUsername("u1")
	a.NotError(err).NotNil(u1)

	identity := p.Identity(u1.ID)
	a.Empty(identity)

	// 未注册，登录不了
	suite.Post("/user/passports/totp/login", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Body([]byte(`{"username":"u1","code":"123"}`)).
		Do(nil).
		Status(http.StatusUnauthorized)

	tk := usertest.GetToken(suite, u)

	secret := &secretVO{}
	suite.Post("/user/passports/totp/secret", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk)).
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.NotError(json.Unmarshal(body, secret)).
				NotEmpty(secret.Secret)
		})

	// 进行关联，但验证码错误
	suite.Post("/user/passports/totp", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk)).
		Body([]byte(`{"username":"u1","code":"123"}`)).
		Do(nil).
		Status(http.StatusBadRequest)
}
