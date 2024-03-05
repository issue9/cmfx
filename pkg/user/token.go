// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"errors"
	"net/http"

	"github.com/issue9/middleware/v6/auth/jwt"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/filters"
)

// AfterFunc 在执行登录和注销行为之后的操作
type AfterFunc = func(int64)

type account struct {
	Username string `json:"username" xml:"username" yaml:"username"`
	Password string `json:"password" xml:"password" yaml:"password"`
}

func (c *account) Filter(v *web.FilterContext) {
	v.Add(filters.RequiredString("username", &c.Username)).
		Add(filters.RequiredString("password", &c.Password))
}

// SetState 设置状态
//
// 如果状态为非 Normal，那么也将会被禁卡登录。
// 需要保证 u.ID、u.State 和 u.NO 是有效的。
func (m *Module) SetState(tx *orm.Tx, u *User, s State) (err error) {
	if u.State == s {
		return nil
	}

	if s != StateNormal {
		err = m.token.BlockUID(u.NO)
	} else {
		err = m.token.RecoverUID(u.NO)
	}

	if err == nil {
		_, err = m.DBEngine(tx).Update(&User{ID: u.ID, State: s}, "state")
	}
	return err
}

// 如果 reg 不为空，表示在验证成功，但是不存在用户数是执行注册服务，其原型如下：
//
//	func(tx *orm.Tx, uid int64, identity string) error
//
// tx 为事务接口，uid 为新用户的 uid，identity 为验证成功时返回的对应值。
// 如果返回 error，将取消整个事务。
func (m *Module) Login(typ string, ctx *web.Context, reg func(*orm.Tx, int64, string) error, after AfterFunc) web.Responser {
	data := &account{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	// 密码错误
	uid, identity, ok := m.auth.Valid(typ, data.Username, data.Password)
	if !ok {
		return ctx.Problem(cmfx.Unauthorized)
	}

	// 注册
	if uid == 0 && reg != nil {
		tx, err := m.DB().Begin()
		if err != nil {
			return ctx.Error(err, "")
		}
		e := m.mod.DBPrefix().Tx(tx)

		a := &User{NO: ctx.Server().UniqueID()}
		uid, err = e.LastInsertID(a)
		if err != nil {
			return ctx.Error(errors.Join(err, tx.Rollback()), "")
		}

		if err := reg(tx, uid, identity); err != nil {
			return ctx.Error(errors.Join(err, tx.Rollback()), "")
		}

		if err := m.AddSecurityLogFromContext(tx, a.ID, ctx, "自动注册"); err != nil { // 记录日志出错不回滚
			ctx.Server().Logs().ERROR().Error(err)
		}

		if err = tx.Commit(); err != nil {
			return ctx.Error(err, "")
		}
	}

	a := &User{ID: uid}
	found, err := m.DBEngine(nil).Select(a)
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
		after(uid)
	}

	return m.token.New(ctx, http.StatusCreated, a.NO)
}

// Logout 注销
func (m *Module) Logout(ctx *web.Context, after AfterFunc) web.Responser {
	uid := m.LoginUser(ctx).ID

	if err := m.token.BlockToken(jwt.GetToken(ctx)); err != nil {
		ctx.Logs().ERROR().Error(err)
	}

	if err := m.AddSecurityLogFromContext(nil, uid, ctx, "主动退出"); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}

	if after != nil {
		after(uid)
	}

	return web.Status(http.StatusNoContent, "Clear-Site-Data", `"cookies", "storage"`)
}

// RefreshToken 刷新 token
func (m *Module) RefreshToken(ctx *web.Context) web.Responser {
	u := m.LoginUser(ctx)
	if u == nil {
		return web.Status(http.StatusUnauthorized)
	}

	if err := m.AddSecurityLogFromContext(nil, u.ID, ctx, "刷新令牌"); err != nil {
		ctx.Logs().ERROR().Error(err)
	}
	return m.token.New(ctx, http.StatusCreated, u.NO)
}

func (m *Module) BlockTokenFromContext(ctx *web.Context) error {
	return m.token.BlockToken(jwt.GetToken(ctx))
}
