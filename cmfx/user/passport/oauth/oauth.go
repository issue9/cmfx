// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package oauth 提供基于 [OAuth2] 的登录和注册功能
//
// ## 大致流程
//  1. 前端访问 authURL
//  1. 三方返回前端的 callback 页面
//  1. callback 提交 {username: 'vendor id', password: 'code'}
//  1. 后端的登录页调用 Authenticator.Valid 验证验录，如果未注册则自动注册；
//  1. 登录页返回 token 给 callback 页，由该页面决定如何处理；
//
// [OAuth2]: https://oauth.net/2/
package oauth

import (
	"context"

	"github.com/issue9/cmfx/cmfx"
	"golang.org/x/oauth2"
)

// UserInfo 表示 OAuth 登录后获取的用户信息
type UserInfo interface {
	// Identity 返回表示在服务器表示用户唯一 ID 的字符串
	Identity() string
}

// GetUserInfoFunc 获取用户信息的方法
//
// OAuth 并未规定返回的用户信息字段，该方法只能由用户根据平台自行实现。
type GetUserInfoFunc[T UserInfo] func(*oauth2.Token) (T, error)

// OAuth 表示 oauth2 登录的验证器
type OAuth[T UserInfo] struct {
	mod    *cmfx.Module
	state  string
	config *oauth2.Config
	f      GetUserInfoFunc[T]
}

// New 声明 OAuth 对象
func New[T UserInfo](mod *cmfx.Module, c *oauth2.Config, g GetUserInfoFunc[T]) *OAuth[T] {
	return &OAuth[T]{
		mod:    mod,
		state:  mod.Server().UniqueID(),
		config: c,
		f:      g,
	}
}

// AuthURL 返回验证地址
func (o *OAuth[T]) AuthURL() string { return o.config.AuthCodeURL(o.state) }

// Valid 验证登录信息
//
// code 为 oauth 服务第一步返回的 code 值；
func (o *OAuth[T]) Valid(state, code string) (int64, string, bool) {
	l := o.mod.Server().Logs()

	if state != o.state {
		l.DEBUG().Printf("用户请求的 state %s 与传递的 state %s 不同", state, o.state)
		return 0, "", false
	}

	token, err := o.config.Exchange(context.Background(), code)
	if err != nil {
		l.ERROR().Error(err)
		return 0, "", false
	}

	info, err := o.f(token)
	if err != nil {
		l.ERROR().Error(err)
		return 0, "", false
	}

	mod := &modelOAuth{Identity: info.Identity()}
	found, err := o.mod.Engine(nil).Select(mod)
	if err != nil {
		l.ERROR().Error(err)
		return 0, "", false
	}
	if !found {
		return 0, info.Identity(), false
	}
	return mod.UID, "", true
}

func (o *OAuth[T]) Delete(uid int64) error {
	_, err := o.mod.Engine(nil).Delete(&modelOAuth{UID: uid})
	return err
}

func (o *OAuth[T]) Identity(uid int64) (string, bool) {
	mod := &modelOAuth{UID: uid}
	found, err := o.mod.Engine(nil).Select(mod)
	if err != nil {
		o.mod.Server().Logs().ERROR().Error(err)
		return "", false
	}
	return mod.Identity, found
}
