// SPDX-License-Identifier: MIT

package user

import (
	"net/http"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/authenticator"
)

type authContextKey string

// Authenticators 管理验证登录信息
func (m *Module) Authenticators() *authenticator.Authenticators { return m.auth }

// AuthFilter 验证是否登录
//
// 同时如果在登录状态下，会将当前登录用户的数据写入 ctx.Vars。
func (m *Module) AuthFilter(next web.HandlerFunc) web.HandlerFunc {
	return m.token.Middleware(func(ctx *web.Context) web.Responser {
		c, found := m.token.GetValue(ctx)
		if !found {
			return web.Status(http.StatusUnauthorized)
		}
		ctx.SetVar(authContextKey(m.mod.ID()), c.User)
		return next(ctx)
	})
}

// LoginUser 获取当前登录的用户信息
//
// 该信息由 AuthFilter 存储在 ctx.Vars() 之中。
func (m *Module) LoginUser(ctx *web.Context) *User {
	no, found := ctx.GetVar(authContextKey(m.mod.ID()))
	if !found {
		ctx.Logs().ERROR().String("未检测到登录用户，可能是该接口未调用 user.AuthFilter 中间件造成的！")
		return nil
	}
	u := &User{NO: no.(string)}
	found, err := m.mod.DBEngine(nil).Select(u)
	if !found {
		ctx.Logs().ERROR().String("未检测到登录用户，可能是该接口未调用 user.AuthFilter 中间件造成的！")
		return nil
	}
	if err != nil {
		ctx.Logs().ERROR().Error(err)
		return nil
	}

	return u
}
