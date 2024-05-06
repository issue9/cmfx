// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"errors"
	"net/http"

	"github.com/issue9/mux/v8/header"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

type tokens = token.Token[*User]

// AfterFunc 在执行登录和注销行为之后的操作
type AfterFunc = func(*User)

type reqAccount struct {
	Username string `json:"username" xml:"username" yaml:"username" cbor:"username"`
	Password string `json:"password" xml:"password" yaml:"password" cbor:"password"`
}

func (c *reqAccount) Filter(v *web.FilterContext) {
	v.Add(filters.NotEmpty("username", &c.Username)).
		Add(filters.NotEmpty("password", &c.Password))
}

// SetState 设置用户状态
//
// 如果状态为非 [StateNormal]，那么也将会被禁止登录。
//
// NOTE: 需要保证 u.ID、u.State 和 u.NO 是有效的。
func (m *Loader) SetState(tx *orm.Tx, u *User, s State) (err error) {
	if u.State == s {
		return nil
	}

	if s != StateNormal {
		err = m.token.Delete(u)
	}

	if err == nil {
		_, err = m.mod.Engine(tx).Update(&User{ID: u.ID, State: s}, "state")
	}
	return err
}

// 如果 reg 不为空，表示在验证成功，但是不存在用户数是执行注册服务，其原型如下：
//
//	func(tx *orm.Tx, uid int64, identity string) error
//
// tx 为事务接口，uid 为新用户的 uid，identity 为验证成功时返回的对应值。
// 如果返回 error，将取消整个事务。
func (m *Loader) Login(typ string, ctx *web.Context, reg func(*orm.Tx, int64, string) error, after AfterFunc) web.Responser {
	data := &reqAccount{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	// 密码错误
	uid, identity, ok := m.passport.Valid(typ, data.Username, data.Password, ctx.Begin())
	if !ok {
		return ctx.Problem(cmfx.Unauthorized)
	}

	// 注册
	if uid == 0 && reg != nil {
		tx, err := m.mod.DB().Begin()
		if err != nil {
			return ctx.Error(err, "")
		}
		e := tx.NewEngine(m.mod.DB().TablePrefix())

		a := &User{NO: ctx.Server().UniqueID()}
		uid, err = e.LastInsertID(a)
		if err != nil {
			return ctx.Error(errors.Join(err, tx.Rollback()), "")
		}

		if err := reg(tx, uid, identity); err != nil {
			return ctx.Error(errors.Join(err, tx.Rollback()), "")
		}

		msg := web.StringPhrase("auto register").LocaleString(ctx.LocalePrinter())
		if err := m.AddSecurityLogFromContext(tx, a.ID, ctx, msg); err != nil { // 记录日志出错不回滚
			ctx.Server().Logs().ERROR().Error(err)
		}

		if err = tx.Commit(); err != nil {
			return ctx.Error(err, "")
		}
	}

	a := &User{ID: uid}
	found, err := m.mod.DB().Select(a)
	if err != nil {
		return ctx.Error(err, "")
	}

	if !found {
		ctx.Logs().DEBUG().Printf("用户名 %v 不存在\n", data.Username)
		return ctx.Problem(cmfx.UnauthorizedRegistrable).WithExtensions(&struct {
			Identity string `json:"identity" xml:"identity" yaml:"identity"`
		}{Identity: identity})
	}

	if a.State != StateNormal {
		return ctx.Problem(cmfx.UnauthorizedInvalidState)
	}

	if err := m.AddSecurityLogFromContext(nil, a.ID, ctx, "登录"); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	if after != nil {
		after(a)
	}

	return m.token.New(ctx, a, http.StatusCreated)
}

// Logout 退出
func (m *Loader) Logout(ctx *web.Context, after AfterFunc, reason web.LocaleStringer) web.Responser {
	u := m.CurrentUser(ctx) // 先拿到用户数据再执行 logout

	if err := m.token.Logout(ctx); err != nil {
		ctx.Logs().ERROR().Error(err) // 输出错误不退出
	}

	msg := reason.LocaleString(ctx.LocalePrinter())
	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, msg); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	if after != nil {
		after(u)
	}

	return web.Status(http.StatusNoContent, header.ClearSiteData, `"cookies", "storage"`)
}

// RefreshToken 刷新令牌
func (m *Loader) RefreshToken(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	if u == nil {
		return web.Status(http.StatusUnauthorized)
	}

	msg := web.StringPhrase("refresh token").LocaleString(ctx.LocalePrinter())
	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, msg); err != nil {
		ctx.Logs().ERROR().Error(err)
	}

	return m.token.Refresh(ctx, http.StatusCreated)
}

// Passport 管理验证登录信息
func (m *Loader) Passport() *passport.Passport { return m.passport }

// Middleware 验证是否登录
func (m *Loader) Middleware(next web.HandlerFunc) web.HandlerFunc { return m.token.Middleware(next) }

// CurrentUser 获取当前登录的用户信息
//
// 该信息由 [Loader.Middleware] 存储在 [web.Context.vars] 之中。
func (m *Loader) CurrentUser(ctx *web.Context) *User {
	if u, found := m.token.GetInfo(ctx); found {
		return u
	}
	panic("未检测到登录用户") // 未登录账号，不应该到达此处，在中间件部分应该已经被拒绝。
}
