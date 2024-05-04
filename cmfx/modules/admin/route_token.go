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
// @req * github.com/issue9/cmfx/cmfx/user.reqAccount
// @resp 201 * github.com/issue9/webuse/v7/middlewares/auth/token.Response
func (l *Loader) postLogin(ctx *web.Context) web.Responser {
	q := &queryLogin{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	return l.user.Login(q.Type, ctx, nil, func(u *user.User) {
		l.loginEvent.Publish(false, u)
	})
}

// # api delete /login 注销当前管理员的登录
// @tag admin auth
// @resp 204 * {}
func (l *Loader) deleteLogin(ctx *web.Context) web.Responser {
	return l.user.Logout(ctx, func(u *user.User) {
		l.logoutEvent.Publish(false, u)
	}, web.Phrase("logout"))
}

// # api get /token 续定 token
// @tag admin auth
// @resp 201 * github.com/issue9/webuse/v7/middlewares/auth/token.Response
func (l *Loader) getToken(ctx *web.Context) web.Responser {
	return l.user.RefreshToken(ctx)
}
