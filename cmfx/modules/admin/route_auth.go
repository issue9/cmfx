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
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport"
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
	ID   string `json:"id" cbor:"id" xml:"id"`
	Desc string `json:"desc" cbor:"desc" xml:"desc"`
}

// # api GET /passports 支持的登录验证方式
// @tag admin auth
// @resp 200 * respAdapters
func (m *Module) getPassports(ctx *web.Context) web.Responser {
	adapters := make([]*respAdapters, 0)
	for k, v := range m.Passport().All(ctx.LocalePrinter()) {
		adapters = append(adapters, &respAdapters{
			ID:   k,
			Desc: v,
		})
	}
	slices.SortFunc(adapters, func(a, b *respAdapters) int { return cmp.Compare(a.ID, b.ID) })

	return web.OK(adapters)
}

// # api POST /passports/{type}/code/{identity} 请求新的验证码
// @tag admin auth
// @path id id 管理员的 ID
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @resp 201 * {}
func (m *Module) postPassportCode(ctx *web.Context) web.Responser {
	typ, resp := ctx.PathString("type", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	a := m.Passport().Get(typ)
	if a == nil {
		return ctx.Problem(cmfx.NotFound)
	}

	identity, resp := ctx.PathString("identity", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	uid, err := a.UID(identity)
	if err != nil {
		return ctx.Error(err, "")
	}
	if err := a.Update(uid); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// # api delete /passports/{type} 取消当前用户与登录方式 type 之间的关联
// @tag admin auth
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @resp 204 * {}
func (m *Module) deletePassport(ctx *web.Context) web.Responser {
	return m.delAdminPassport(ctx, m.getPassport)
}

// # api delete /admins/{id}/passports/{type} 取消用户 id 与登录方式 type 之间的关联
// @tag admin auth
// @path id id 管理员的 ID
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @resp 204 * {}
func (m *Module) deleteAdminPassport(ctx *web.Context) web.Responser {
	return m.delAdminPassport(ctx, m.getAdminPassport)
}

func (m *Module) delAdminPassport(ctx *web.Context, f func(ctx *web.Context) (u *user.User, a passport.Adapter, resp web.Responser)) web.Responser {
	u, a, resp := f(ctx)
	if resp != nil {
		return resp
	}

	if err := a.Delete(u.ID); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

// 验证用户当次请求的数据
type reqValidation struct {
	Type     string `json:"type" cbor:"type" xml:"type"`
	Identity string `json:"identity" cbor:"identity" xml:"identity"`
	Password string `json:"password" cbor:"password" xml:"password"`
}

func (v *reqValidation) Filter(c *web.FilterContext) {
	c.Add(filters.NotEmpty("type", &v.Type)).
		Add(filters.NotEmpty("identity", &v.Identity)).
		Add(filters.NotEmpty("password", &v.Password))
}

func (v *reqValidation) valid(ctx *web.Context, u *user.User, p *passport.Passport) bool {
	adp := p.Get(v.Type)
	if adp == nil {
		return false
	}

	uid, _, err := adp.Valid(v.Identity, v.Password, ctx.Begin())
	return err == nil && uid == u.ID
}

type reqPassport struct {
	// 用于验证的数据
	Validate *reqValidation `json:"validate" xml:"validate" cbor:"validate"`

	// 被修改的数据

	Identity string `json:"identity" cbor:"identity" xml:"identity"`
	Code     string `json:"code" cbor:"code" xml:"code"`
}

// # api POST /passports/{type} 建立当前用户与登录方式 type 之间的关联
// @tag admin auth
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @req * reqPassport
// @resp 201 * {}
func (m *Module) postPassport(ctx *web.Context) web.Responser {
	return m.addAdminPassport(ctx, m.getPassport)
}

// # api POST /admins/{id}/passports/{type} 建立用户 id 与登录方式 type 之间的关联
// @tag admin auth
// @path id id 管理员的 ID
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @req * reqPassport
// @resp 201 * {}
func (m *Module) postAdminPassport(ctx *web.Context) web.Responser {
	return m.addAdminPassport(ctx, m.getAdminPassport)
}

func (m *Module) addAdminPassport(ctx *web.Context, f func(ctx *web.Context) (u *user.User, a passport.Adapter, resp web.Responser)) web.Responser {
	u, a, resp := f(ctx)
	if resp != nil {
		return resp
	}

	data := &reqPassport{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if !data.Validate.valid(ctx, u, m.Passport()) {
		return ctx.Problem(cmfx.Unauthorized)
	}

	if err := a.Add(u.ID, data.Identity, data.Code, ctx.Begin()); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

// # api patch /passports/{type} 修改当前用户的登录方式 type 的认证数据
// @tag admin auth
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @req * reqPassport
// @resp 204 * {}
func (m *Module) patchPassport(ctx *web.Context) web.Responser {
	return m.editAdminPassport(ctx, m.getPassport)
}

// # api patch /admins/{id}/passports/{type} 修改用户 id 的登录方式 type 的认证数据
// @tag admin auth
// @path id id 管理员的 ID
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @req * reqPassport
// @resp 204 * {}
func (m *Module) patchAdminPassport(ctx *web.Context) web.Responser {
	return m.editAdminPassport(ctx, m.getAdminPassport)
}

func (m *Module) editAdminPassport(ctx *web.Context, f func(ctx *web.Context) (u *user.User, a passport.Adapter, resp web.Responser)) web.Responser {
	u, adp, resp := f(ctx)
	if resp != nil {
		return resp
	}

	data := &reqPassport{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if !data.Validate.valid(ctx, u, m.Passport()) {
		return ctx.Problem(cmfx.Unauthorized)
	}

	if err := adp.Delete(u.ID); err != nil {
		return ctx.Error(err, "")
	}
	if err := adp.Add(u.ID, data.Identity, data.Code, ctx.Begin()); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

func (m *Module) getPassport(ctx *web.Context) (*user.User, passport.Adapter, web.Responser) {
	u := m.CurrentUser(ctx)

	typ, resp := ctx.PathString("type", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return nil, nil, resp
	}

	a := m.Passport().Get(typ)
	if a == nil {
		return nil, nil, ctx.Problem(cmfx.NotFound)
	}

	return u, a, nil
}

func (m *Module) getAdminPassport(ctx *web.Context) (*user.User, passport.Adapter, web.Responser) {
	u, resp := m.getActiveUserFromContext(ctx)
	if resp != nil {
		return nil, nil, resp
	}

	typ, resp := ctx.PathString("type", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return nil, nil, resp
	}

	a := m.Passport().Get(typ)
	if a == nil {
		return nil, nil, ctx.Problem(cmfx.NotFound)
	}

	return u, a, nil
}

func (m *Module) getActiveUserFromContext(ctx *web.Context) (*user.User, web.Responser) {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return nil, resp
	}

	u, err := m.user.GetUser(id)
	if err != nil {
		return nil, ctx.Error(err, "")
	}
	if u.State == user.StateDeleted {
		return nil, ctx.Problem(cmfx.ForbiddenStateNotAllow)
	}

	return u, nil
}
