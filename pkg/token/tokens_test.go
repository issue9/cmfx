// SPDX-License-Identifier: MIT

package token

import (
	"encoding/json"
	"net/http"
	"testing"
	"time"

	gojwt "github.com/golang-jwt/jwt/v4"
	"github.com/issue9/assert/v3"
	"github.com/issue9/middleware/v6/jwt"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/pkg/test"
)

var _ web.Middleware = &Tokens[*defaultClaims]{}

func TestTokens_loadData_and_scanJob(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	Install(suite.Server(), m, suite.DB())
	now := time.Now()

	e := orm.Prefix(m).DB(suite.DB())
	err := e.InsertMany(10, []orm.TableNamer{
		&blockedToken{Token: "1", Expired: now.Add(-10 * time.Second)},
		&blockedToken{Token: "2", Expired: now.Add(time.Hour)},
	}...)
	a.NotError(err)

	err = e.InsertMany(10, []orm.TableNamer{
		&discardUser{UserID: "1", Expired: now.Add(-10 * time.Second)},
		&discardUser{UserID: "2", Expired: now.Add(time.Hour)},
	}...)
	a.NotError(err)

	tks, err := NewTokens(suite.Server(), m, suite.DB(), BuildClaims, 60, 0, "job")
	a.NotError(err).NotNil(tks).
		False(tks.TokenIsBlocked("1")).
		True(tks.TokenIsBlocked("2")).
		False(tks.TokenIsBlocked("not-exists")).
		False(tks.ClaimsIsBlocked(&defaultClaims{User: "1"})).
		True(tks.ClaimsIsBlocked(&defaultClaims{User: "2"})).
		False(tks.ClaimsIsBlocked(&defaultClaims{User: "1000"}))
	tks.AddHMAC("hmac", gojwt.SigningMethodHS256, []byte("hmac"))

	// 此时数据库里数据依然是各两条，AddTicker 的 imm 为 false，不会立即执行。
	cnt, err := e.Where("1=1").Count(&blockedToken{})
	a.NotError(err).Equal(2, cnt)
	cnt, err = e.Where("1=1").Count(&discardUser{})
	a.NotError(err).Equal(2, cnt)

	// 执行回收操作
	a.NotError(tks.scanJob(time.Now()))
	cnt, err = e.Where("1=1").Count(&blockedToken{})
	a.NotError(err).Equal(1, cnt)
	cnt, err = e.Where("1=1").Count(&discardUser{})
	a.NotError(err).Equal(1, cnt)
}

func TestTokens_New(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	Install(suite.Server(), m, suite.DB())
	s := servertest.NewTester(a, nil)
	r := s.Router()

	tks, err := NewTokens(suite.Server(), m, suite.DB(), BuildClaims, 60, 0, "job")
	a.NotError(err).NotNil(tks)
	tks.AddHMAC("hmac", gojwt.SigningMethodHS256, []byte("hmac"))
	r.Post("/login", func(ctx *web.Context) web.Responser {
		return tks.New(ctx, http.StatusCreated, NewClaims("1"))
	})

	r.Post("/refresh", tks.Middleware(func(ctx *web.Context) web.Responser {
		if xx, found := tks.GetValue(ctx); found {
			if xx.BaseToken() == "" {
				return web.Status(http.StatusForbidden)
			}

			if err := tks.BlockToken(tks.GetToken(ctx)); err != nil {
				return ctx.InternalServerError(err)
			}
			if err := tks.BlockToken(xx.BaseToken()); err != nil {
				return ctx.InternalServerError(err)
			}
			return tks.New(ctx, http.StatusCreated, NewClaims(xx.UserID()))
		}
		return web.Status(http.StatusUnauthorized)
	}))

	r.Get("/info", tks.Middleware(func(ctx *web.Context) web.Responser {
		if xx, found := tks.GetValue(ctx); found && xx.UserID() == "1" {
			return web.OK(nil)
		}
		return web.Status(http.StatusUnauthorized)
	}))

	s.GoServe()
	defer s.Close(0)

	s.NewRequest(http.MethodPost, "/login", nil).
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			resp1 := &jwt.Response{}
			a.NotError(json.Unmarshal(body, resp1), "err:%s", string(body))
			a.NotEmpty(resp1.Access).
				NotEmpty(resp1.Refresh).
				NotZero(resp1.Expires).
				NotEqual(resp1.Access, resp1.Refresh)

			s.Get("/info").Do(nil).Status(http.StatusUnauthorized) // 未指定 token
			s.Get("/info").Header("Authorization", resp1.Access).Do(nil).Status(http.StatusOK)

			// 未传递报头
			s.NewRequest(http.MethodPost, "/refresh", nil).
				Do(nil).
				Status(http.StatusUnauthorized)

			// 报头不是 Refresh
			s.NewRequest(http.MethodPost, "/refresh", nil).
				Header("authorization", resp1.Access).
				Do(nil).
				Status(http.StatusForbidden)

			// 正常更换刷新令牌
			s.NewRequest(http.MethodPost, "/refresh", nil).
				Header("authorization", resp1.Refresh).
				Do(nil).
				BodyFunc(func(a *assert.Assertion, body []byte) {
					resp2 := &jwt.Response{}
					a.NotError(json.Unmarshal(body, resp2), "err:%s", string(body))
					a.NotEmpty(resp2.Access).
						NotEmpty(resp2.Refresh).
						NotZero(resp2.Expires).
						NotEqual(resp2.Access, resp2.Refresh).
						NotEqual(resp1.Access, resp2.Access).
						NotEqual(resp1.Refresh, resp2.Refresh).
						True(resp2.Expires >= resp1.Expires) // 小于 1 秒，时间上体现不出来。

					// resp1 已经过时
					s.Get("/info").
						Header("Authorization", resp1.Access).
						Do(nil).
						Status(http.StatusUnauthorized)
					s.NewRequest(http.MethodPost, "/refresh", nil).
						Header("authorization", resp1.Refresh).
						Do(nil).
						Status(http.StatusUnauthorized)

					// resp2 可用
					s.Get("/info").
						Header("Authorization", resp2.Access).
						Do(nil).
						Status(http.StatusOK)
					s.NewRequest(http.MethodPost, "/refresh", nil).
						Header("authorization", resp2.Refresh).
						Do(nil).
						Status(http.StatusCreated)
				})
		})
}
