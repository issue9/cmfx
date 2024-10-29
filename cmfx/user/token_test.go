// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strconv"
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/passport/otp/code"
)

func TestLoader_Login(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	u := newModule(s)

	// 添加用于测试的验证码验证
	code.Install(u.Module(), "_code")
	pc := code.New(u.Module(), time.Second, "code", nil, code.NewEmptySender(), web.Phrase("code"))
	u.Passport().Register(pc)
	a.NotError(pc.Add(0, "new", "password", time.Now()))

	s.Module().Router().Post("/login", func(ctx *web.Context) web.Responser {
		q, err := ctx.Queries(true)
		if err != nil {
			return ctx.Error(err, "")
		}

		switch q.String("type", "password") {
		case "password":
			output := &bytes.Buffer{}
			resp := u.Login("password", ctx, func(id int64) error {
				_, err := output.WriteString(strconv.FormatInt(id, 10))
				return err
			}, func(_ *User) {
				output.WriteString("after")
			})

			a.NotNil(resp).Equal(output.String(), "after") // 用户已经存在
			return resp
		case "code":
			output := &bytes.Buffer{}
			resp := u.Login("code", ctx, func(id int64) error {
				_, err := output.WriteString(strconv.FormatInt(id, 10))
				return err
			}, func(_ *User) { output.WriteString("after") })

			a.NotNil(resp).Equal(output.String(), "2after") // 注册的新用户
			return resp
		default:
			return ctx.NotImplemented()
		}
	})

	// 测试 SetState
	s.Module().Router().Post("/state", func(ctx *web.Context) web.Responser {
		user := u.CurrentUser(ctx)
		a.NotError(u.SetState(nil, user, StateNormal))
		a.NotError(u.SetState(nil, user, StateLocked))
		return web.NoContent()
	}, u)

	s.Module().Router().Post("/refresh", func(ctx *web.Context) web.Responser {
		return u.RefreshToken(ctx)
	}, u)

	s.Module().Router().Get("/info", func(ctx *web.Context) web.Responser {
		return web.OK(u.CurrentUser(ctx))
	}, u)

	s.Module().Router().Delete("/login", func(ctx *web.Context) web.Responser {
		return u.Logout(ctx, nil, web.Phrase("reason"))
	}, u)

	defer servertest.Run(a, s.Module().Server())()
	defer s.Close()

	//--------------------------- user 1 -------------------------------------

	tk1 := &token.Response{}
	s.Post("/login", []byte(`{"username":"admin","password":"password"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, tk1)) })

	s.Post("/state", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk1.AccessToken)).
		Do(nil).
		Status(http.StatusNoContent)

	// 状态已改变
	s.Get("/info").
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk1.AccessToken)).
		Do(nil).
		Status(http.StatusUnauthorized)

	//--------------------------- user 2 -------------------------------------

	tk1 = &token.Response{}
	s.Post("/login?type=code", []byte(`{"username":"new","password":"password"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, tk1)) })

	// 正常
	s.Get("/info").
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk1.AccessToken)).
		Do(nil).
		Status(http.StatusOK)

	tk2 := &token.Response{}
	s.Post("/refresh", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk1.RefreshToken)).
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, tk2)) })
	a.NotEqual(tk1.AccessToken, tk2.AccessToken).
		NotEqual(tk1.AccessToken, tk2.AccessToken)

	// 退出 tk2
	s.Delete("/login").
		Header(header.Accept, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk2.AccessToken)).
		Do(nil).
		Status(http.StatusNoContent)

	// tk2 已退出
	s.Get("/info").
		Header(header.Accept, header.JSON).
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk2.AccessToken)).
		Do(nil).
		Status(http.StatusUnauthorized)
}
