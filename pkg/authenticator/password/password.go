// SPDX-License-Identifier: MIT

// Package password 密码类型的验证器
package password

import (
	"errors"

	"github.com/issue9/cmfx"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
	"golang.org/x/crypto/bcrypt"

	"github.com/issue9/cmfx/pkg/authenticator"
)

const defaultCost = 11

type Password struct {
	mod cmfx.Module
}

// New 声明 Password 对象
//
// prefix 表名前缀，当有多个不同实例时，prefix 不能相同。
func New(mod cmfx.Module) *Password {
	return &Password{mod: mod}
}

// Add 添加账号
//
// 如果 tx 为空，那么将采用 orm.DB 访问数据库。
func (p *Password) Add(tx *orm.Tx, uid int64, identity, pass string) error {
	db := p.mod.DBEngine(tx)

	n, err := db.Where("identity=?", identity).Count(&modelPassword{})
	if err != nil {
		return err
	}
	if n > 0 {
		return authenticator.ErrExists
	}

	pa, err := bcrypt.GenerateFromPassword([]byte(pass), defaultCost)
	if err != nil {
		return err
	}
	_, err = db.Insert(&modelPassword{
		UID:      uid,
		Identity: identity,
		Password: pa,
	})
	return err
}

// Delete 删除关联的密码信息
func (p *Password) Delete(tx *orm.Tx, uid int64) error {
	_, err := p.mod.DBEngine(tx).Delete(&modelPassword{UID: uid})
	return err
}

// Set 强制修改密码
func (p *Password) Set(tx *orm.Tx, uid int64, pass string) error {
	pa, err := bcrypt.GenerateFromPassword([]byte(pass), defaultCost)
	if err != nil {
		return err
	}

	_, err = p.mod.DBEngine(tx).Update(&modelPassword{
		UID:      uid,
		Password: pa,
	})
	return err
}

// Change 验证并修改
func (p *Password) Change(tx *orm.Tx, uid int64, old, pass string) error {
	pp := &modelPassword{UID: uid}
	found, err := p.mod.DBEngine(tx).Select(pp)
	if err != nil {
		return err
	}
	if !found {
		return web.NewLocaleError("user %s not found", uid)
	}

	err = bcrypt.CompareHashAndPassword(pp.Password, []byte(old))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return authenticator.ErrUnauthorized
	case err != nil:
		return err
	default:
		return p.Set(tx, uid, pass)
	}
}

// Valid 验证登录正确性并返回其 uid
func (p *Password) Valid(username, pass string) (int64, string, bool) {
	pp := &modelPassword{Identity: username}
	found, err := p.mod.DBEngine(nil).Select(pp)
	if err != nil {
		p.mod.Server().Logs().ERROR().Error(err)
		return 0, "", false
	}
	if !found {
		p.mod.Server().Logs().DEBUG().Printf("用户 %s 不存在", username)
		return 0, "", false
	}

	err = bcrypt.CompareHashAndPassword(pp.Password, []byte(pass))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return 0, "", false
	case err != nil:
		p.mod.Server().Logs().ERROR().Error(err)
		return 0, "", false
	default:
		return pp.UID, "", true
	}
}

func (p *Password) Identity(uid int64) (string, bool) {
	pp := &modelPassword{UID: uid}
	found, err := p.mod.DBEngine(nil).Select(pp)
	if err != nil {
		p.mod.Server().Logs().ERROR().Error(err)
		return "", false
	}
	if !found {
		p.mod.Server().Logs().ERROR().Printf("用户 %d 不存在", uid)
		return "", false
	}

	return pp.Identity, true
}
