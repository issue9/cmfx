// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"cmp"
	"errors"
	"slices"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

// # API POST /login 管理员登录
// @tag admin auth
// @req * github.com/issue9/cmfx/cmfx/user.Account
// @resp 201 * github.com/issue9/webuse/v7/middlewares/auth/token.Response
func (m *Module) postLogin(ctx *web.Context) web.Responser {
	return m.user.Login(ctx, nil, func(u *user.User) {
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

type respPassportAdapters struct {
	ID   string `json:"id" cbor:"id" xml:"id"`
	Desc string `json:"desc" cbor:"desc" xml:"desc"`
}

// # api GET /passports 支持的登录验证方式
// @tag admin auth
// @resp 200 * respPassportAdapters
func (m *Module) getPassports(ctx *web.Context) web.Responser {
	adapters := make([]*respPassportAdapters, 0)
	for k, v := range m.Passport().All(ctx.LocalePrinter()) {
		adapters = append(adapters, &respPassportAdapters{
			ID:   k,
			Desc: v,
		})
	}
	slices.SortFunc(adapters, func(a, b *respPassportAdapters) int { return cmp.Compare(a.ID, b.ID) })

	return web.OK(adapters)
}

// # api POST /passports/{type}/code/{identity} 请求新的验证码
// @tag admin auth
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @path identity string 在 {type} 适配器中注册的用户标记，如果不存在将返回 404；
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
	if errors.Is(err, passport.ErrIdentityNotExists()) {
		return ctx.Problem(cmfx.NotFound)
	} else if err != nil {
		return ctx.Error(err, "")
	}

	if err := a.Update(uid); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// # api POST /passports/{type}/code 请求新的验证码
// @tag admin auth
// @path id id 管理员的 ID
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @resp 201 * {}
func (m *Module) postCurrentPassportCode(ctx *web.Context) web.Responser {
	u, a, resp := m.getPassport(ctx)
	if resp != nil {
		return resp
	}

	if err := a.Update(u.ID); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// # api delete /passports/{type} 取消当前用户与登录方式 type 之间的关联
// @tag admin auth
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @resp 204 * {}
func (m *Module) deletePassport(ctx *web.Context) web.Responser {
	u, a, resp := m.getPassport(ctx)
	if resp != nil {
		return resp
	}

	// 判断是否为最后个验证方式
	cnt := 0
	for range m.Passport().Identities(u.ID) {
		cnt++
		if cnt > 1 { // 多余一个了，之后的就没必要了统计了。
			break
		}
	}
	if cnt <= 1 {
		return ctx.Problem(cmfx.BadRequestLastPassport)
	}

	if err := a.Delete(u.ID); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

type reqPassport struct {
	Username string `json:"username" cbor:"username" xml:"username"`
	Password string `json:"password" cbor:"password" xml:"password"`
}

// # api POST /passports/{type} 建立当前用户与登录方式 type 之间的关联
// @tag admin auth
// @path type string 登录的类型，该值必须是由 /passports 返回列表中的 id 值。
// @req * reqPassport
// @resp 201 * {}
func (m *Module) postPassport(ctx *web.Context) web.Responser {
	u, a, resp := m.getPassport(ctx)
	if resp != nil {
		return resp
	}

	data := &reqPassport{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := a.Add(u.ID, data.Username, data.Password, ctx.Begin()); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
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

func (m *Module) getUserFromPath(ctx *web.Context) (*user.User, web.Responser) {
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
