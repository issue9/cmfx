// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/pkg/query"
	"github.com/issue9/cmfx/pkg/test"
)

func TestSecurityLog(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := suite.NewModule("test")
	Install(m)

	o := &Config{
		URLPrefix:      "/admin",
		AccessExpires:  60,
		RefreshExpires: 120,
		Algorithms: []*Algorithm{
			{
				Type:    "HMAC",
				Name:    "HS256",
				Public:  "1112345",
				Private: "1112345",
			},
		},
	}
	suite.Assertion().NotError(o.SanitizeConfig())

	mod, err := NewModule(m, o)
	a.NotError(err).NotNil(mod)
	a.NotError(mod.AddSecurityLog(nil, 1, "127.0.0.0", "firefox", "change password"))
	a.NotError(mod.AddSecurityLog(nil, 1, "127.0.0.1", "chrome", "change username"))

	defer servertest.Run(a, suite.Server)()
	defer suite.Close()

	mod.Router().Get("/securitylog/{uid}", func(ctx *web.Context) web.Responser {
		uid, resp := ctx.PathID("uid", web.ProblemNotFound)
		if resp != nil {
			return resp
		}
		return mod.getSecurityLogs(uid, ctx)
	})

	suite.Get("/securitylog/1?size=5").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[respLog]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 2).Equal(2, page.Count)
		})

	suite.Get("/securitylog/1?size=1").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[respLog]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 1).Equal(2, page.Count)
		})

	// 不存在的 uid
	suite.Get("/securitylog/10?size=1").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusNotFound)
}
