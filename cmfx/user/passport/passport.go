// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package passport 用户验证
package passport

import (
	"fmt"
	"time"

	"github.com/issue9/web"
	"golang.org/x/text/message"

	"github.com/issue9/cmfx/cmfx"
)

// Passport 验证器管理
type Passport struct {
	adapters map[string]*adapter
	expired  time.Duration
}

type adapter struct {
	id         string
	name       web.LocaleStringer
	auth       Adapter
	identities map[string]time.Time
}

// New 声明 [Passport] 对象
//
// d 每个验证失败的 ID 过期时间同时也是回收的频率；
func New(mod *cmfx.Module, d time.Duration) *Passport {
	auth := &Passport{
		adapters: make(map[string]*adapter, 5),
		expired:  d,
	}
	msg := web.Phrase("recycle auth id for %s", mod.Desc())
	mod.Server().Services().AddTicker(msg, auth.gc, d, false, false)

	return auth
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
		id:         id,
		name:       name,
		auth:       auth,
		identities: make(map[string]time.Time, 5),
	}
}

// Valid 验证账号密码
//
// id 表示通过 [Passport.Register] 注册验证器时的 id；
//
// 返回参数同 [Adapter.Valid]
func (p *Passport) Valid(id, identity, password string) (int64, string, bool) {
	if info, found := p.adapters[id]; found {
		uid, ident, ok := info.auth.Valid(identity, password)
		if ok {
			return uid, "", true
		} else if ident != "" {
			p.adapters[id].identities[ident] = time.Now().Add(p.expired)
			return 0, identity, false
		}
	}
	return 0, "", false
}

// IdentityExpired 验证由 [Adapter.Valid] 返回的值是否还能使用
func (p *Passport) IdentityExpired(id, identity string) bool {
	auth := p.adapters[id]

	expired, found := auth.identities[identity]
	if !found {
		return false
	}

	if expired.Before(time.Now()) {
		delete(p.adapters[id].identities, identity)
		return false
	}
	return true
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
		if identity, found := info.auth.Identity(uid); found {
			m[info.id] = identity
		}
	}
	return m
}

// 执行回收过期 identity 的方法
func (p *Passport) gc(now time.Time) error {
	for _, auth := range p.adapters {
		for k, v := range auth.identities {
			if v.Before(now) {
				delete(auth.identities, k)
			}
		}
	}
	return nil
}
