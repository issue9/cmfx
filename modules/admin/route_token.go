// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"
	"strconv"

	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/filters"
	"github.com/issue9/cmfx/pkg/token"
)

type cert struct {
	XMLName  struct{} `json:"-" xml:"login"`
	Username string   `json:"username" xml:"username"`
	Password string   `json:"password" xml:"password"`
}

func (c *cert) CTXFilter(v *web.FilterProblem) {
	v.AddFilter(filters.RequiredString("username", &c.Username)).
		AddFilter(filters.RequiredString("password", &c.Password))
}

// # API POST /login 管理员登录
// @tag admin auth
// @req * cert
// @resp 201 * github.com/issue9/middleware/v6/jwt.Response
func (m *Admin) postLogin(ctx *web.Context) web.Responser {
	data := &cert{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	// 密码错误
	uid, identity, found := m.auth.Valid(authPasswordType, data.Username, data.Password)
	if !found {
		return ctx.Problem(cmfx.Unauthorized)
	}

	a := &modelAdmin{ID: uid}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if err != nil {
		return ctx.InternalServerError(err)
	}

	if !found {
		ctx.Server().Logs().DEBUG().Printf("用户名 %v 不存在\n", data.Username)
		p := ctx.Problem(cmfx.UnauthorizedRegistrable)
		p.With("identity", identity)
		return p
	}

	if a.State != StateNormal {
		return ctx.Problem(cmfx.UnauthorizedInvalidState)
	}

	if err := m.securitylog.AddWithContext(a.ID, ctx, "登录"); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	m.loginEvent.Publish(false, a.ID)

	return m.tokenServer.New(ctx, http.StatusCreated, token.NewClaims(ctx, strconv.FormatInt(a.ID, 10)))
}

// # api delete /login 注销当前管理员的登录
// @tag admin auth
// @resp 204 * {}
func (m *Admin) deleteLogin(ctx *web.Context) web.Responser {
	if err := m.tokenServer.BlockToken(m.tokenServer.GetToken(ctx)); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	a := m.LoginUser(ctx)
	m.logoutEvent.Publish(false, a.ID)

	return web.Status(http.StatusNoContent, "Clear-Site-Data", `"cookies", "storage"`)
}

// # api get /token 续定 token
// @tag admin auth
// @resp 201 * github.com/issue9/middleware/v6/jwt.Response
func (m *Admin) getToken(ctx *web.Context) web.Responser {
	if xx, found := m.tokenServer.GetValue(ctx); found {
		if xx.BaseToken() == "" {
			return web.Status(http.StatusForbidden)
		}

		if err := m.tokenServer.BlockToken(m.tokenServer.GetToken(ctx)); err != nil {
			return ctx.InternalServerError(err)
		}
		if err := m.tokenServer.BlockToken(xx.BaseToken()); err != nil {
			return ctx.InternalServerError(err)
		}

		uid, err := strconv.ParseInt(xx.User, 10, 64)
		if err != nil {
			return ctx.InternalServerError(err)
		}
		if err := m.securitylog.AddWithContext(uid, ctx, "刷新令牌"); err != nil {
			ctx.Server().Logs().ERROR().Error(err)
		}

		return m.tokenServer.New(ctx, http.StatusCreated, token.NewClaims(ctx, xx.User))
	}
	return web.Status(http.StatusUnauthorized)
}
