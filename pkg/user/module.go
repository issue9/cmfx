// SPDX-License-Identifier: MIT

// Package user 会员账号
package user

import (
	"net/http"
	"time"

	"github.com/issue9/cmfx"
	"github.com/issue9/web"
	"github.com/issue9/web/server"

	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/config"
	"github.com/issue9/cmfx/pkg/token"
)

type contextKey string

type Module struct {
	mod       cmfx.Module
	urlPrefix string // 所有接口的 URL 前缀
	token     *token.Tokens
	auth      *authenticator.Authenticators
}

// id 拥有此对象的模块；
func NewModule(mod cmfx.Module, conf *config.User) (*Module, error) {
	tks, err := config.NewTokens(mod, conf, web.Phrase("gc token for %s", mod.Desc()))
	if err != nil {
		return nil, web.NewStackError(err)
	}

	m := &Module{
		mod:       mod,
		urlPrefix: conf.URLPrefix,
		token:     tks,
		auth:      authenticator.NewAuthenticators(mod.Server(), time.Minute*2, web.Phrase("gc auth id")),
	}
	return m, nil
}

func (m *Module) URLPrefix() string { return m.urlPrefix }

// Router 声明以 [Module.URLPrefix] 为前缀的路径
func (m *Module) Router(r *web.Router, ms ...web.Middleware) *server.Prefix {
	return r.Prefix(m.URLPrefix(), ms...)
}

// AuthFilter 验证是否登录
//
// 同时如果在登录状态下，会将当前登录用户的数据写入 ctx.Vars。
func (m *Module) AuthFilter(next web.HandlerFunc) web.HandlerFunc {
	return m.token.Middleware(func(ctx *web.Context) web.Responser {
		c, found := m.token.GetValue(ctx)
		if !found {
			return web.Status(http.StatusUnauthorized)
		}
		ctx.SetVar(contextKey(m.mod.ID()), c.User)
		return next(ctx)
	})
}

// Authenticators 管理验证登录信息
func (m *Module) Authenticators() *authenticator.Authenticators { return m.auth }

// LoginUser 获取当前登录的用户信息
//
// 该信息由 AuthFilter 存储在 ctx.Vars() 之中。
func (m *Module) LoginUser(ctx *web.Context) *User {
	no, found := ctx.GetVar(contextKey(m.mod.ID()))
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

func (m *Module) Module() cmfx.Module { return m.mod }