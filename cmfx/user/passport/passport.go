// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package passport 用户验证
package passport

import (
	"errors"
	"fmt"
	"iter"
	"slices"
	"time"

	"golang.org/x/text/message"

	"github.com/issue9/cmfx/cmfx"
)

// Passport 验证器管理
type Passport struct {
	mod      *cmfx.Module
	adapters []Adapter
}

// New 声明 [Passport] 对象
func New(mod *cmfx.Module) *Passport {
	return &Passport{
		mod:      mod,
		adapters: make([]Adapter, 0, 5),
	}
}

// Register 注册 [Adapter]
func (p *Passport) Register(adp Adapter) {
	if slices.IndexFunc(p.adapters, func(a Adapter) bool { return a.ID() == adp.ID() }) >= 0 {
		panic(fmt.Sprintf("已经存在同名 %s 的验证器", adp.ID()))
	}
	p.adapters = append(p.adapters, adp)
}

// Get 返回注册的适配器
//
// 如果找不到，则返回 nil。
func (p *Passport) Get(id string) Adapter {
	if index := slices.IndexFunc(p.adapters, func(a Adapter) bool { return a.ID() == id }); index >= 0 {
		return p.adapters[index]
	}
	return nil
}

// Valid 验证账号密码
//
// id 表示通过 [Passport.Register] 注册适配器时的 id；
func (p *Passport) Valid(id, identity, password string, now time.Time) (int64, string, bool) {
	if a := p.Get(id); a != nil {
		uid, ident, err := a.Valid(identity, password, now)
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

// Set 验证并修改某个用户的验证信息
//
// vID 用于验证的适配器 ID；
// vIdentty 用于验证的账号信息；
// vPass 用于验证的密码；
// sID 需要修改的适配器 ID；
// sIdent 需要修改的账号；
// sValue 需要修改的密码；
func (p *Passport) Set(vID, vIdent, vPass string, now time.Time, sID, sIdent, sPass string) error {
	uid, _, ok := p.Valid(vID, vIdent, vPass, now)
	if !ok {
		return ErrUnauthorized()
	}

	adp := p.Get(sID)
	if adp == nil {
		return ErrAdapterNotFound()
	}

	if err := adp.Delete(uid); err != nil {
		return err
	}
	return adp.Add(uid, sIdent, sPass, now)
}

// All 返回所有的适配器对象
func (p *Passport) All(printer *message.Printer) iter.Seq2[string, string] {
	return func(yield func(string, string) bool) {
		for _, a := range p.adapters {
			if !yield(a.ID(), a.Description().LocaleString(printer)) {
				break
			}
		}
	}
}

// Identities 获取 uid 已经关联的适配器
//
// 返回值键名为验证器 id，键值为该适配器对应的账号。
func (p *Passport) Identities(uid int64) iter.Seq2[string, string] {
	return func(yield func(string, string) bool) {
		for _, info := range p.adapters {
			if identity, err := info.Identity(uid); err == nil {
				if !yield(info.ID(), identity) {
					break
				}
			} else {
				p.mod.Server().Logs().ERROR().Error(err)
			}
		}
	}
}

// ClearUser 清空与 uid 相关的所有登录信息
func (p *Passport) ClearUser(uid int64) error {
	for _, info := range p.adapters {
		if err := info.Delete(uid); err != nil {
			return err
		}
	}
	return nil
}
