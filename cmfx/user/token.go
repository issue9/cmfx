// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"net/http"
	"time"

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
	XMLName  struct{} `xml:"account" json:"-" cbor:"-"`
	Username string   `json:"username" xml:"username" yaml:"username" cbor:"username"`
	Password string   `json:"password" xml:"password" yaml:"password" cbor:"password"`
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
func (m *Module) SetState(tx *orm.Tx, u *User, s State) (err error) {
	if u.State == s {
		return nil
	}

	if s != StateNormal {
		err = m.token.Delete(u) // 用到 User.NO
	}

	if err == nil {
		_, err = m.mod.Engine(tx).Update(&User{ID: u.ID, State: s}, "state")
	}
	return err
}

// Login 执行登录操作并在成功的情况下发放新的令牌
//
// 如果 reg 不为空，表示在验证成功，但是不存在用户数是执行注册服务，其原型如下：
//
//	func( uid int64) error
//
// uid 为新用户的 uid。
func (m *Module) Login(typ string, ctx *web.Context, reg func(int64) error, after AfterFunc) web.Responser {
	data := &reqAccount{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	uid, identity, ok := m.passport.Valid(typ, data.Username, data.Password, ctx.Begin())
	if !ok { // 密码或账号错误
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	}

	// 注册
	if uid == 0 && reg != nil {
		var err error
		if uid, err = m.NewUser(m.Passport().Get(typ), identity, data.Password, ctx.Begin()); err != nil {
			return ctx.Error(err, "")
		}

		if err := reg(uid); err != nil {
			return ctx.Error(err, "")
		}

		msg := web.StringPhrase("auto register").LocaleString(ctx.LocalePrinter())
		if err := m.AddSecurityLogFromContext(nil, uid, ctx, msg); err != nil { // 记录日志出错不回滚
			ctx.Server().Logs().ERROR().Error(err)
		}
	}

	u := &User{ID: uid}
	found, err := m.mod.DB().Select(u)
	if err != nil {
		return ctx.Error(err, "")
	}

	if !found {
		ctx.Logs().DEBUG().Printf("数据库不同步，%s 存在于适配器 %s，但是不存在于用户列表数据库\n", data.Username, typ)
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	}

	if u.State != StateNormal {
		return ctx.Problem(cmfx.UnauthorizedInvalidState)
	}

	msg := web.Phrase("login").LocaleString(ctx.LocalePrinter())
	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, msg); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	if after != nil {
		after(u)
	}

	return m.token.New(ctx, u, http.StatusCreated)
}

// Logout 退出
func (m *Module) Logout(ctx *web.Context, after AfterFunc, reason web.LocaleStringer) web.Responser {
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
func (m *Module) RefreshToken(ctx *web.Context) web.Responser {
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
func (m *Module) Passport() *passport.Passport { return m.passport }

// Middleware 验证是否登录
func (m *Module) Middleware(next web.HandlerFunc) web.HandlerFunc { return m.token.Middleware(next) }

// CurrentUser 获取当前登录的用户信息
//
// 该信息由 [Module.Middleware] 存储在 [web.Context.vars] 之中。
func (m *Module) CurrentUser(ctx *web.Context) *User {
	if u, found := m.token.GetInfo(ctx); found {
		return u
	}
	panic("未检测到登录用户") // 未登录账号，不应该到达此处，在中间件部分应该已经被拒绝。
}

// NewUser 添加新用户
//
// pa 为注册用户的验证方式
func (m *Module) NewUser(pa passport.Adapter, identity, password string, t time.Time) (int64, error) {
	u := &User{NO: m.Module().Server().UniqueID()}
	uid, err := m.mod.DB().LastInsertID(u)
	if err != nil {
		return 0, err
	}

	if err = pa.Add(uid, identity, password, t); err != nil {
		return 0, err
	}

	return uid, nil
}
