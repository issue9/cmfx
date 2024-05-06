// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package code 发送一次性验证码类型的验证
package code

import (
	"database/sql"
	"time"

	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

type code struct {
	db      *orm.DB
	send    SendFunc
	expired time.Duration
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_auth_" + tableName)
}

// New 声明基于验证码的验证方法
//
// expired 表示验证码的过期时间；
// tableName 用于指定验证码的表名，需要在同一个 mod 环境下是唯一的；
func New(mod *cmfx.Module, expired time.Duration, tableName string, send SendFunc) passport.Adapter {
	return &code{
		db:      buildDB(mod, tableName),
		send:    send,
		expired: expired,
	}
}

func (e *code) Delete(uid int64) error {
	_, err := e.db.Delete(&modelCode{UID: uid})
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
	mod := &modelCode{UID: uid}
	found, err := e.db.Select(mod)
	if err != nil {
		return "", err
	}
	if !found {
		return "", passport.ErrUIDNotExists()
	}
	return mod.Identity, nil
}

func (e *code) Change(uid int64, pass, code string) error {
	m := e.getModel(uid)
	if m == nil {
		return passport.ErrUIDNotExists()
	}
	if m.Verified.Valid || m.Expired.Before(time.Now()) || m.Code != pass {
		return passport.ErrUnauthorized()
	}

	return e.set(uid, m.Identity, code)
}

func (e *code) Set(uid int64, code string) error {
	m := e.getModel(uid)
	if m == nil {
		return passport.ErrUIDNotExists()
	}
	return e.set(uid, m.Identity, code)
}

func (e *code) set(uid int64, identity, code string) error {
	if _, err := e.db.Update(&modelCode{UID: uid, Code: code}, "code", "uid"); err != nil {
		return err
	}

	return e.send(identity, code)
}

// Add 注册新用户
//
// code 为验证码，可以用于验证，但是并不会真的发送该验证码。
func (e *code) Add(uid int64, identity, code string, now time.Time) error {
	if e.getModel(uid) != nil {
		return passport.ErrUIDExists()
	}

	m := &modelCode{Identity: identity}
	f, err := e.db.Select(m)
	if err != nil {
		return err
	}
	if f {
		return passport.ErrIdentityExists()
	}

	_, err = e.db.Insert(&modelCode{
		Created:  now,
		Expired:  now.Add(e.expired),
		Verified: sql.NullTime{},
		Identity: identity,
		UID:      uid,
		Code:     code,
	})
	return err
}

func (e *code) getModel(uid int64) *modelCode {
	m := &modelCode{UID: uid}
	if f, err := e.db.Select(m); err == nil && f {
		return m
	}
	return nil
}
