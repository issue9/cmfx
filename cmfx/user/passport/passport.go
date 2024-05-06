// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package passport 用户验证
package passport

import (
	"errors"
	"fmt"
	"time"

	"github.com/issue9/web"
	"golang.org/x/text/message"

	"github.com/issue9/cmfx/cmfx"
)

// Passport 验证器管理
type Passport struct {
	mod      *cmfx.Module
	adapters map[string]*adapter
}

type adapter struct {
	id   string
	name web.LocaleStringer
	auth Adapter
}

// New 声明 [Passport] 对象
func New(mod *cmfx.Module) *Passport {
	return &Passport{
		mod:      mod,
		adapters: make(map[string]*adapter, 5),
	}
}

// Register 注册 [Adapter]
//
// id 为适配器的类型名称，需要唯一；
// name 为该验证器的本地化名称；
func (p *Passport) Register(id string, auth Adapter, name web.LocaleStringer) {
	if _, found := p.adapters[id]; found {
		panic(fmt.Sprintf("已经存在同名 %s 的验证器", id))
	}

	p.adapters[id] = &adapter{
		id:   id,
		name: name,
		auth: auth,
	}
}

// Valid 验证账号密码
//
// id 表示通过 [Passport.Register] 注册验证器时的 id；
func (p *Passport) Valid(id, identity, password string, now time.Time) (int64, string, bool) {
	if info, found := p.adapters[id]; found {
		uid, ident, err := info.auth.Valid(identity, password, now)
		switch {
		case errors.Is(err, ErrUnauthorized()):
			return 0, "", false
		case err != nil:
			p.mod.Server().Logs().ERROR().Error(err)
			return 0, "", false
		default:
			return uid, ident, true
		}
	}
	return 0, "", false
}

// All 返回所有的验证器
func (p *Passport) All(printer *message.Printer) map[string]string {
	m := make(map[string]string, len(p.adapters))
	for _, i := range p.adapters {
		m[i.id] = i.name.LocaleString(printer)
	}
	return m
}

// Identities 获取 uid 已经关联的验证器
//
// 返回值键名为验证器 id，键值为该验证器对应的账号。
func (p *Passport) Identities(uid int64) map[string]string {
	m := make(map[string]string, len(p.adapters))
	for _, info := range p.adapters {
		if identity, err := info.auth.Identity(uid); err == nil {
			m[info.id] = identity
		} else {
			p.mod.Server().Logs().ERROR().Error(err)
		}
	}
	return m
}
