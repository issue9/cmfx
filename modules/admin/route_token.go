// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

type loginQuery struct {
	Type string `query:"type"`
}

// # API POST /login 管理员登录
// @tag admin auth
// @req * github.com/issue9/cmfx/pkg/user.account
// @resp 201 * github.com/issue9/middleware/v6/jwt.Response
func (m *Admin) postLogin(ctx *web.Context) web.Responser {
	q := &loginQuery{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	return m.user.Login(q.Type, ctx, nil, func(id int64) {
		m.loginEvent.Publish(false, id)
	})
}

// # api delete /login 注销当前管理员的登录
// @tag admin auth
// @resp 204 * {}
func (m *Admin) deleteLogin(ctx *web.Context) web.Responser {
	return m.user.Logout(ctx, func(id int64) {
		m.logoutEvent.Publish(false, id)
	})
}

// # api get /token 续定 token
// @tag admin auth
// @resp 201 * github.com/issue9/middleware/v6/jwt.Response
func (m *Admin) getToken(ctx *web.Context) web.Responser {
	return m.user.RefreshToken(ctx)
}
