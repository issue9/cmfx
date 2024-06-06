// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/locales"
)

type queryLogin struct {
	m    *Module
	Type string `query:"type,password"`
}

func (q *queryLogin) Filter(c *web.FilterContext) {
	v := func(s string) bool { return q.m.user.Passport().Get(s) != nil }
	c.Add(filter.NewBuilder(filter.V(v, locales.InvalidValue))("type", &q.Type))
}

// # API POST /login 管理员登录
// @tag admin auth
// @query queryLogin
// @req * github.com/issue9/cmfx/cmfx/user.reqAccount
// @resp 201 * github.com/issue9/webuse/v7/middlewares/auth/token.Response
func (m *Module) postLogin(ctx *web.Context) web.Responser {
	q := &queryLogin{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	return m.user.Login(q.Type, ctx, nil, func(u *user.User) {
		m.loginEvent.Publish(false, u)
	})
}

// # api delete /login 注销当前管理员的登录
// @tag admin auth
// @resp 204 * {}
func (m *Module) deleteLogin(ctx *web.Context) web.Responser {
	return m.user.Logout(ctx, func(u *user.User) {
		m.logoutEvent.Publish(false, u)
	}, web.StringPhrase("logout"))
}

// # api put /login 续定令牌
// @tag admin auth
// @resp 201 * github.com/issue9/webuse/v7/middlewares/auth/token.Response
func (m *Module) putToken(ctx *web.Context) web.Responser {
	return m.user.RefreshToken(ctx)
}
