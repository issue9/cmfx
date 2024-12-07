// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"net/http"

	"github.com/issue9/mux/v9/header"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/middlewares/auth/token"
	"golang.org/x/crypto/bcrypt"

	"github.com/issue9/cmfx/cmfx"
)

type tokens = token.Token[*User]

// SetState 设置用户状态
//
// 如果状态为非 [StateNormal]，那么也将会被禁止登录。
//
// NOTE: 需要保证 u.ID、u.State 和 u.NO 是有效的。
func (m *Module) SetState(tx *orm.Tx, u *User, s State) error {
	if u.State == s {
		return nil
	}

	if s != StateNormal { // 正常状态下需要考虑其是否在登录状态，如果是登录状态，则删除其登录的令牌。
		m.token.Delete(u) // 用到 User.NO。非登录状态下，会返回错误，忽略。
	}

	if s == StateDeleted { // 删除所有的登录信息
		if err := m.deleteUser(u.ID); err != nil {
			m.mod.Server().Logs().ERROR().Error(err) // 记录错误，但是不退出
		}
	}

	_, err := m.mod.Engine(tx).Update(&User{ID: u.ID, State: s}, "state")
	return err
}

// CreateToken 为用户 u 生成登录令牌
func (m *Module) CreateToken(ctx *web.Context, u *User, p Passport) web.Responser {
	if u.State != StateNormal {
		return ctx.Problem(cmfx.UnauthorizedInvalidState)
	}

	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, web.Phrase("login by %s", p.ID())); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	m.loginEvent.Publish(true, u)

	return m.token.New(ctx, u, http.StatusCreated)
}

func (m *Module) logout(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx) // 先拿到用户数据再执行 logout

	if err := m.token.Logout(ctx); err != nil {
		ctx.Logs().ERROR().Error(err) // 输出错误不退出
	}

	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, web.Phrase("user logout")); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	m.logoutEvent.Publish(true, u)

	return web.Status(http.StatusNoContent, header.ClearSiteData, `"cookies", "storage"`)
}

// RefreshToken 刷新令牌
func (m *Module) refreshToken(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	if u == nil {
		return web.Status(http.StatusUnauthorized)
	}

	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, web.StringPhrase("refresh token")); err != nil {
		ctx.Logs().ERROR().Error(err)
	}

	return m.token.Refresh(ctx, http.StatusCreated)
}

// Middleware 验证是否登录
func (m *Module) Middleware(next web.HandlerFunc, method, path, router string) web.HandlerFunc {
	return m.token.Middleware(next, method, path, router)
}

// CurrentUser 获取当前登录的用户信息
func (m *Module) CurrentUser(ctx *web.Context) *User {
	if u, found := m.token.GetInfo(ctx); found {
		return u
	}
	panic("未检测到登录用户") // 未登录账号，不应该到达此处，在中间件部分应该已经被拒绝。
}

// New 添加新用户
//
// 返回新添加的用户 ID
// ip 客户的 IP；
// ua 客户端的标记；
// content 添加时的备注；
func (m *Module) New(s State, username, password string, ip, ua, content string) (int64, error) {
	pa, err := bcrypt.GenerateFromPassword([]byte(password), defaultCost)
	if err != nil {
		return 0, err
	}

	u := &User{
		NO:       m.mod.Server().UniqueID(),
		State:    s,
		Username: username,
		Password: pa,
	}

	m.mod.DB().DoTransaction(func(tx *orm.Tx) error {
		uid, err := tx.LastInsertID(u)
		if err != nil {
			return err
		}
		u.ID = uid
		return m.AddSecurityLog(tx, uid, ip, ua, content)
	})

	m.addEvent.Publish(true, u)
	return u.ID, nil
}
