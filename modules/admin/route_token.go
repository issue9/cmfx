// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"

	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/rules"
)

type cert struct {
	XMLName  struct{} `json:"-" xml:"login"`
	Username string   `json:"username" xml:"username"`
	Password string   `json:"password" xml:"password"`
}

func (c *cert) CTXSanitize(v *web.Validation) {
	v.AddField(c.Username, "username", rules.Required).
		AddField(c.Password, "password", rules.Required)
}

// <api method="POST" summary="管理员登录">
// <path path="/login" />
// <server>admin</server>
// <tag>admin</tag>
// <tag>auth</tag>
// <request type="object" name="login">
//
//	<param name="username" type="string" summary="用户名" />
//	<param name="password" type="string" summary="密码" />
//
// </request>
// <response status="201" type="object">
//
//	<param name="uid" type="number" summary="用户 ID" />
//	<param name="expires" type="number" summary="过期时间，单位秒" />
//	<param name="access_token" type="string" summary="AccessToken" />
//	<param name="refresh_token" type="string" summary="RefreshToken" />
//
// </response>
// </api>
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

	a := &ModelAdmin{ID: uid}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if err != nil {
		return ctx.InternalServerError(err)
	}

	if !found {
		ctx.Server().Logs().Debugf("用户名 %v 不存在\n", data.Username)
		p := ctx.Problem(cmfx.UnauthorizedRegistrable)
		p.With("identity", identity)
		return p
	}

	if a.State != StateNormal {
		return ctx.Problem(cmfx.UnauthorizedInvalidState)
	}

	if err := m.securitylog.AddWithContext(a.ID, ctx, "登录"); err != nil {
		ctx.Server().Logs().Error(err)
	}

	m.loginEvent.Publish(false, a.ID)

	return m.tokenServer.New(ctx, http.StatusCreated, newClaims(a.ID))
}

// <api method="DELETE" summary="注销当前管理员的登录">
// <path path="/login" />
// <server>admin</server>
// <tag>admin</tag>
// <tag>auth</tag>
// <response status="204" />
// </api>
func (m *Admin) deleteLogin(ctx *web.Context) web.Responser {
	if err := m.tokenServer.BlockToken(m.tokenServer.GetToken(ctx)); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	a := m.LoginUser(ctx)
	m.logoutEvent.Publish(false, a.ID)

	return web.Status(http.StatusNoContent, "Clear-Site-Data", `"cookies", "storage"`)
}

// <api method="get" summary="续定 token">
//
//	<server>admin</server>
//	<tag>auth</tag>
//	<tag>admin</tag>
//	<path path="/token" />
//	<request>
//	    <header name="Authorization" type="string" summary="登录凭证 token" />
//	</request>
//	<response status="201" type="object">
//	    <param name="uid" type="number" summary="用户 ID" />
//	    <param name="expires" type="number" summary="过期时间，单位秒" />
//	    <param name="access_token" type="string" summary="AccessToken" />
//	    <param name="refresh_token" type="string" summary="refreshToken" />
//	</response>
//
// </api>
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

		if err := m.securitylog.AddWithContext(xx.UID, ctx, "刷新令牌"); err != nil {
			ctx.Server().Logs().Error(err)
		}

		return m.tokenServer.New(ctx, http.StatusCreated, newClaims(xx.UID))
	}
	return web.Status(http.StatusUnauthorized)
}
