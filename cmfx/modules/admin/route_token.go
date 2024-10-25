// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"cmp"
	"slices"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/user"
)

type queryLogin struct {
	m    *Module
	Type string `query:"type,password"`
}

func (q *queryLogin) Filter(c *web.FilterContext) {
	v := func(s string) bool { return q.m.Passport().Get(s) != nil }
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

type respAdapters struct {
	Name string `json:"name" cbor:"name" xml:"name"`
	Desc string `json:"desc" cbor:"desc" xml:"desc"`
}

// # api GET /passports 支持的登录验证方式
// #tag admin auth
// @resp 200 * respAdapters
func (m *Module) getPassports(ctx *web.Context) web.Responser {
	adapters := make([]*respAdapters, 0)
	for k, v := range m.Passport().All(ctx.LocalePrinter()) {
		adapters = append(adapters, &respAdapters{
			Name: k,
			Desc: v,
		})
	}
	slices.SortFunc(adapters, func(a, b *respAdapters) int { return cmp.Compare(a.Name, b.Name) })

	return web.OK(adapters)
}
