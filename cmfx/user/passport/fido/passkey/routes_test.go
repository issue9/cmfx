// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

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
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

func TestPasskey(t *testing.T) {
	a := assert.New(t, false)

	suite := test.NewSuite(a)

	u := usertest.NewModule(suite)
	Install(u.Module(), "passkey")
	p := Init(u, "passkey", web.Phrase("totp"), 10*time.Minute, "http://localhost:8080")

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	u1, err := u.GetUserByUsername("u1")
	a.NotError(err).NotNil(u1)

	identity, state := p.Identity(u1.ID)
	a.Equal(state, -1).Empty(identity)

	// 未注册，登录不了
	suite.Post("/user/passports/passkey/login/u1", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Body([]byte(``)).
		Do(nil).
		Status(http.StatusUnauthorized)

	tk := usertest.GetToken(suite, u)

	suite.Get("/user/passports/passkey/register").
		Header(header.Accept, header.JSON).
		Header(header.Authorization, auth.BearerToken(tk)).
		Header(header.ContentType, header.JSON).
		Body([]byte(``)).
		Do(nil).
		Status(http.StatusOK)
}
