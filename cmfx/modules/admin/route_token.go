// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
)

type queryLogin struct {
	Type string `query:"type"`
}

// # API POST /login 管理员登录
// @tag admin auth
// @req * github.com/issue9/cmfx/pkg/user.account
// @resp 201 * github.com/issue9/middleware/v6/auth/jwt.Response
func (m *Loader) postLogin(ctx *web.Context) web.Responser {
	q := &queryLogin{}
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
func (m *Loader) deleteLogin(ctx *web.Context) web.Responser {
	return m.user.Logout(ctx, func(u *user.User) {
		m.logoutEvent.Publish(false, u)
	}, web.Phrase("logout"))
}

// # api get /token 续定 token
// @tag admin auth
// @resp 201 * github.com/issue9/middleware/v6/auth/jwt.Response
func (m *Loader) getToken(ctx *web.Context) web.Responser {
	return m.user.RefreshToken(ctx)
}
