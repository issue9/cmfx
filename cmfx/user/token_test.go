// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package user_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport/otp/code"
	"github.com/issue9/cmfx/cmfx/user/passport/otp/code/codetest"
)

func TestModule_routes(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)

	u := NewModule(s)

	// 添加用于测试的验证码验证
	code.Install(u.Module(), "code")
	sender := codetest.New()
	code.Init(u, time.Second, time.Second, nil, sender, "code", web.Phrase("code"))

	// 测试 SetState
	s.Module().Router().Post("/state", func(ctx *web.Context) web.Responser {
		usr := u.CurrentUser(ctx)
		a.NotError(u.SetState(nil, usr, user.StateNormal))
		a.NotError(u.SetState(nil, usr, user.StateLocked))
		return web.NoContent()
	}, u)

	s.Module().Router().Get("/info", func(ctx *web.Context) web.Responser {
		return web.OK(u.CurrentUser(ctx))
	}, u)

	defer servertest.Run(a, s.Module().Server())()
	defer s.Close()

	//--------------------------- user 1 -------------------------------------

	tk1 := &token.Response{}
	s.Post("/user/passports/password/login", []byte(`{"username":"user","password":"123"}`)).
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

	s.Post("/user/passports/code/login/code", []byte(`{"target":"new"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { fmt.Println(string(body)) })
	a.NotEmpty(sender.Code)

	//  NOTE: 该用户不存在

	tk1 = &token.Response{}
	s.Post("/user/passports/code/login", []byte(`{"target":"new","code":"`+sender.Code+`"}`)).
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
	s.Put("/user/token", nil).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON+"; charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, tk1.RefreshToken)).
		Do(nil).
		Status(http.StatusCreated).
		BodyFunc(func(a *assert.Assertion, body []byte) { a.NotError(json.Unmarshal(body, tk2)) })
	a.NotEqual(tk1.AccessToken, tk2.AccessToken).
		NotEqual(tk1.AccessToken, tk2.AccessToken)

	// 退出 tk2
	s.Delete("/user/token").
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

func TestModule_New(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	u := NewModule(s)

	_, err := u.New(user.StateDeleted, "uu", "pwd", "", "ua", "")
	a.Equal(err, web.NewLocaleError("can not add user with %s state", user.StateDeleted))

	_, err = u.New(user.StateLocked, "user", "pwd", "", "ua", "")
	a.Equal(err, web.NewLocaleError("username %s exists", "user"))

	id, err := u.New(user.StateLocked, "u2", "pwd", "", "ua", "")
	a.NotError(err).True(id > 0)
}
