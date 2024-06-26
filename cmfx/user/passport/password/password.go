// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package password 密码类型的验证器
package password

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

type password struct {
	mod  *cmfx.Module
	cost int
}

// New 声明基于密码的验证方法
//
// cost 的值需介于 [bcrypt.MinCost,bcrypt.MaxCost] 之间，如果超出范围则会被设置为 [bcrypt.DefaultCost]。
func New(mod *cmfx.Module, cost int) passport.Adapter {
	if cost < bcrypt.MinCost || cost > bcrypt.MaxCost {
		cost = bcrypt.DefaultCost
	}
	return &password{mod: mod, cost: cost}
}

// Add 添加账号
func (p *password) Add(uid int64, identity, pass string, now time.Time) error {
	if !validIdentity(identity) {
		return passport.ErrInvalidIdentity()
	}

	db := p.mod.DB()

	n, err := db.Where("uid=?", uid).Count(&modelPassword{})
	if err != nil {
		return err
	}
	if uid > 0 && n > 0 {
		return passport.ErrUIDExists()
	}

	mod := &modelPassword{Identity: identity}
	found, err := db.Select(mod)
	if err != nil {
		return err
	}

	pa, err := bcrypt.GenerateFromPassword([]byte(pass), p.cost)
	if err != nil {
		return err
	}

	if found {
		if mod.UID > 0 {
			return passport.ErrIdentityExists()
		}

		_, err = db.Update(&modelPassword{
			Updated:  now,
			UID:      uid,
			Identity: identity,
			Password: pa,
		})
	} else {
		_, err = db.Insert(&modelPassword{
			Created:  now,
			Updated:  now,
			UID:      uid,
			Identity: identity,
			Password: pa,
		})
	}

	return err
}

// Delete 删除关联的密码信息
func (p *password) Delete(uid int64) error {
	_, err := p.mod.DB().Where("uid=?", uid).Delete(&modelPassword{})
	return err
}

// Set 强制修改密码
func (p *password) Set(uid int64, pass string) error {
	if uid == 0 {
		return passport.ErrUIDMustBeGreatThanZero()
	}

	mod := &modelPassword{}
	size, err := p.mod.DB().Where("uid=?", uid).Select(true, mod)
	if err != nil {
		return err
	}
	if size == 0 {
		return passport.ErrUIDNotExists()
	}
	return p.set(mod.Identity, pass)
}

func (p *password) set(identity, pass string) error {
	pa, err := bcrypt.GenerateFromPassword([]byte(pass), p.cost)
	if err == nil {
		_, err = p.mod.DB().Update(&modelPassword{Identity: identity, Password: pa})
	}
	return err
}

// Change 验证并修改
func (p *password) Change(uid int64, old, pass string) error {
	if uid == 0 {
		return passport.ErrUIDMustBeGreatThanZero()
	}

	mod := &modelPassword{UID: uid}
	size, err := p.mod.DB().Where("uid=?", uid).Select(true, mod)
	if err != nil {
		return err
	}
	if size == 0 {
		return passport.ErrUIDNotExists()
	}

	err = bcrypt.CompareHashAndPassword(mod.Password, []byte(old))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return passport.ErrUnauthorized()
	case err != nil:
		return err
	default:
		return p.set(mod.Identity, pass)
	}
}

func (p *password) Valid(username, pass string, _ time.Time) (int64, string, error) {
	mod := &modelPassword{Identity: username}
	found, err := p.mod.DB().Select(mod)
	if err != nil {
		return 0, "", err
	}
	if !found {
		return 0, "", passport.ErrUnauthorized()
	}

	err = bcrypt.CompareHashAndPassword(mod.Password, []byte(pass))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return 0, "", passport.ErrUnauthorized()
	case err != nil:
		return 0, "", err
	default:
		return mod.UID, mod.Identity, nil
	}
}

func (p *password) Identity(uid int64) (string, error) {
	mod := &modelPassword{}
	size, err := p.mod.DB().Where("uid=?", uid).Select(true, mod)
	if err != nil {
		return "", err
	}
	if size == 0 {
		return "", passport.ErrUIDNotExists()
	}

	return mod.Identity, nil
}

func validIdentity(id string) bool {
	if id == "" {
		return false
	}

	for _, r := range id {
		if !isAlpha(r) && !isDigit(r) {
			return false
		}
	}

	return true
}

func isAlpha(r rune) bool { return r >= 'A' && r <= 'Z' || r >= 'a' && r <= 'z' }

func isDigit(r rune) bool { return r >= '0' && r <= '9' }
