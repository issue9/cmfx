// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"encoding/json"
	"net/http"
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/config"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/query"
)

func TestSecurityLog(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("test")
	Install(mod)

	conf := &Config{
		URLPrefix:     "/admin",
		AccessExpired: config.Duration(time.Hour),
	}
	suite.Assertion().NotError(conf.SanitizeConfig())

	l := Load(mod, conf)
	a.NotNil(l).
		NotError(l.AddSecurityLog(nil, 1, "127.0.0.0", "firefox", "change password")).
		NotError(l.AddSecurityLog(nil, 1, "127.0.0.1", "chrome", "change username"))

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	l.mod.Router().Get("/securitylog/{uid}", func(ctx *web.Context) web.Responser {
		uid, resp := ctx.PathID("uid", web.ProblemNotFound)
		if resp != nil {
			return resp
		}
		return l.getSecurityLogs(uid, ctx)
	})

	suite.Get("/securitylog/1?size=5").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[LogVO]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 2).Equal(2, page.Count)
		})

	suite.Get("/securitylog/1?size=1").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[LogVO]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 1).Equal(2, page.Count)
		})

	// 不存在的 uid
	suite.Get("/securitylog/10?size=1").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusNotFound)
}
