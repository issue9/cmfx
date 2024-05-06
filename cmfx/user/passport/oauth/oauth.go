// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package oauth 提供基于 [OAuth2] 的登录和注册功能
//
// ## 大致流程
//  1. 前端携带 state 访问 authURL
//  1. 三方返回前端的 callback 页面
//  1. callback 提交 {username: 'vendor id', password: 'code'}
//  1. 后端的登录页调用 Authenticator.Valid 验证验录，如果未注册则自动注册；
//  1. 登录页返回 token 给 callback 页，由该页面决定如何处理；
//
// [OAuth2]: https://oauth.net/2/
package oauth

import (
	"context"
	"errors"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"golang.org/x/oauth2"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
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
	db     *orm.DB
	state  string
	config *oauth2.Config
	f      GetUserInfoFunc[T]
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_auth_" + tableName)
}

// New 声明 [OAuth] 对象
func New[T UserInfo](mod *cmfx.Module, tableName string, c *oauth2.Config, g GetUserInfoFunc[T]) *OAuth[T] {
	return &OAuth[T]{
		db:     buildDB(mod, tableName),
		state:  mod.Server().UniqueID(),
		config: c,
		f:      g,
	}
}

// AuthURL 返回验证地址
func (o *OAuth[T]) AuthURL() string { return o.config.AuthCodeURL(o.state) }

// Valid 验证登录信息
//
// state 为 oauth2 服务从 [OAuth.AuthURL] 返回的值；
func (o *OAuth[T]) Valid(state, code string, _ time.Time) (int64, string, error) {
	if state != o.state {
		return 0, "", web.NewLocaleError("different state %s %s", state, o.state)
	}

	token, err := o.config.Exchange(context.Background(), code)
	if err != nil {
		return 0, "", err
	}

	info, err := o.f(token)
	if err != nil {
		return 0, "", err
	}

	mod := &modelOAuth{Identity: info.Identity()}
	found, err := o.db.Select(mod)
	if err != nil {
		return 0, "", err
	}

	if !found {
		return 0, info.Identity(), nil
	}
	return mod.UID, info.Identity(), nil
}

func (o *OAuth[T]) Delete(uid int64) error {
	_, err := o.db.Delete(&modelOAuth{UID: uid})
	return err
}

func (o *OAuth[T]) Identity(uid int64) (string, error) {
	mod := &modelOAuth{UID: uid}
	found, err := o.db.Select(mod)
	if err != nil {
		return "", err
	}
	if !found {
		return "", passport.ErrUIDNotExists()
	}
	return mod.Identity, nil
}

func (o *OAuth[T]) Change(uid int64, pass, n string) error {
	return errors.ErrUnsupported
}

func (o *OAuth[T]) Set(uid int64, n string) error {
	return errors.ErrUnsupported
}

func (o *OAuth[T]) Add(uid int64, identity, _ string, now time.Time) error {
	_, err := o.db.Insert(&modelOAuth{
		Created:  now,
		UID:      uid,
		Identity: identity,
	})
	return err
}
