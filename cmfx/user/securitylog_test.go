// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user_test

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

func TestSecurityLog(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)

	l := usertest.NewModule(suite)
	a.NotError(l.AddSecurityLog(nil, 1, "127.0.0.0", "firefox", "change password")).
		NotError(l.AddSecurityLog(nil, 1, "127.0.0.1", "chrome", "change username"))

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	token := usertest.GetToken(suite, l)

	suite.Get("/user/securitylog?size=5").
		Header(header.Accept, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, token)).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[user.LogVO]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 4).Equal(4, page.Count) // 添加，登录，以及上面手动添加的两条记录
		})

	suite.Get("/user/securitylog?size=1").
		Header(header.Accept, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, token)).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[user.LogVO]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 1).Equal(4, page.Count)
		})
}
