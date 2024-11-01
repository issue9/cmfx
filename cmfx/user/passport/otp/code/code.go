// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package code 发送一次性验证码类型的验证
package code

import (
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/utils"
)

type code struct {
	db      *orm.DB
	sender  Sender
	expired time.Duration
	gen     Generator
	id      string
	desc    web.LocaleStringer
}

// New 声明基于验证码的验证方法
//
// id 该适配器的唯一 ID，同时也作为表名的一部分，不应该包含特殊字符；
// expired 表示验证码的过期时间；
// tableName 用于指定验证码的表名，需要在同一个 mod 环境下是唯一的；
func New(mod *cmfx.Module, expired time.Duration, id string, gen Generator, sender Sender, desc web.LocaleStringer) passport.Adapter {
	if gen == nil {
		gen = NumberGenerator(mod.Server(), id, 4)
	}

	return &code{
		db:      utils.BuildDB(mod, id),
		sender:  sender,
		expired: expired,
		gen:     gen,
		id:      id,
		desc:    desc,
	}
}

func (e *code) ID() string { return e.id }

func (e *code) Description() web.LocaleStringer { return e.desc }

func (e *code) Delete(uid int64) error {
	_, err := e.db.Where("uid=?", uid).Delete(&modelCode{}) // uid == 0 也是有效值
	return err
}

func (e *code) Valid(identity, code string, now time.Time) (int64, string, error) {
	mod := &modelCode{Identity: identity}
	found, err := e.db.Select(mod)
	if err != nil {
		return 0, "", err
	}

	if !found || mod.Code != code || mod.Verified.Valid || mod.Expired.Before(now) {
		return 0, "", passport.ErrUnauthorized()
	}

	return mod.UID, identity, nil
}

func (e *code) Identity(uid int64) (string, error) {
	mod := &modelCode{}
	size, err := e.db.Where("uid=?", uid).Select(true, mod)
	if err != nil {
		return "", err
	}
	if size == 0 {
		return "", passport.ErrUIDNotExists()
	}
	return mod.Identity, nil
}

func (e *code) UID(identity string) (int64, error) {
	mod := &modelCode{}
	size, err := e.db.Where("identity=?", identity).Select(true, mod)
	if err != nil {
		return 0, err
	}
	if size == 0 {
		return 0, passport.ErrIdentityNotExists()
	}
	return mod.UID, nil
}

func (e *code) Update(uid int64) error {
	if uid == 0 {
		return passport.ErrUIDMustBeGreatThanZero()
	}

	m := e.getModel(uid)
	if m == nil {
		return passport.ErrUIDNotExists()
	}

	code := e.gen()

	if _, err := e.db.Update(&modelCode{Identity: m.Identity, Code: code}, "code"); err != nil {
		return err
	}
	return e.sender.Sent(m.Identity, code)
}

// Add 注册新用户
//
// code 为验证码，可以用于验证，但是并不会真的发送该验证码。
func (e *code) Add(uid int64, identity, code string, now time.Time) error {
	if !e.sender.ValidIdentity(identity) {
		return passport.ErrInvalidIdentity()
	}

	if uid > 0 && e.getModel(uid) != nil {
		return passport.ErrUIDExists()
	}

	mod := &modelCode{Identity: identity}
	found, err := e.db.Select(mod)
	if err != nil {
		return err
	}
	if found {
		if mod.UID > 0 {
			return passport.ErrIdentityExists()
		}

		_, err = e.db.Update(&modelCode{
			UID:      uid,
			Identity: identity,
			Code:     code,
		})
	} else {
		_, err = e.db.Insert(&modelCode{
			Created:  now,
			Expired:  now.Add(e.expired),
			Identity: identity,
			UID:      uid,
			Code:     code,
		})
	}

	return err
}

func (e *code) getModel(uid int64) *modelCode {
	m := &modelCode{}
	if f, err := e.db.Where("uid=?", uid).Select(true, m); err == nil && f > 0 {
		return m
	}
	return nil
}
