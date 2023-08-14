// SPDX-License-Identifier: MIT

package securitylog

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/pkg/query"
	"github.com/issue9/cmfx/pkg/test"
)

func TestSecurityLog(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	Install(suite.Server, m, suite.DB())

	l := New(m, suite.DB())
	a.NotNil(l)
	a.NotError(l.Add(1, "127.0.0.0", "firefox", "change password"))
	a.NotError(l.Add(1, "127.0.0.1", "chrome", "change username"))

	defer servertest.Run(a, suite.Server)()
	defer suite.Close()

	suite.NewRouter("", nil).Get("/securitylog/{uid}", func(ctx *web.Context) web.Responser {
		uid, resp := ctx.PathID("uid", web.ProblemNotFound)
		if resp != nil {
			return resp
		}
		return l.GetHandle(uid, ctx)
	})

	suite.Get("/securitylog/1?size=5").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[Log]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 2).Equal(2, page.Count)
		})

	suite.Get("/securitylog/1?size=1").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			page := &query.Page[Log]{}
			a.NotError(json.Unmarshal(body, page))
			a.Length(page.Current, 1).Equal(2, page.Count)
		})

	// 不存在的 uid
	suite.Get("/securitylog/10?size=1").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusNotFound)
}
