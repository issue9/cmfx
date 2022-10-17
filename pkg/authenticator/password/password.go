// SPDX-License-Identifier: MIT

// Package password 密码类型的验证器
package password

import (
	"errors"
	"fmt"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
	"golang.org/x/crypto/bcrypt"

	"github.com/issue9/cmfx/pkg/authenticator"
)

const defaultCost = 11

type Password struct {
	s        *web.Server
	dbPrefix orm.Prefix
	db       *orm.DB
}

// New 声明 Password 对象
//
// prefix 表名前缀，当有多个不同实例时，prefix 不能相同。
func New(s *web.Server, prefix orm.Prefix, db *orm.DB) *Password {
	return &Password{
		s:        s,
		dbPrefix: prefix,
		db:       db,
	}
}

func (p *Password) modelEngine(tx *orm.Tx) orm.ModelEngine {
	if tx == nil {
		return p.dbPrefix.DB(p.db)
	} else {
		return p.dbPrefix.Tx(tx)
	}
}

// Add 添加账号
//
// 如果 tx 为空，那么将采用 orm.DB 访问数据库。
func (p *Password) Add(tx *orm.Tx, uid int64, identity, pass string) error {
	db := p.modelEngine(tx)

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
	_, err := p.modelEngine(tx).Delete(&modelPassword{UID: uid})
	return err
}

// Set 修改密码
func (p *Password) Set(tx *orm.Tx, uid int64, pass string) error {
	pa, err := bcrypt.GenerateFromPassword([]byte(pass), defaultCost)
	if err != nil {
		return err
	}

	_, err = p.modelEngine(tx).Update(&modelPassword{
		UID:      uid,
		Password: pa,
	})
	return err
}

func (p *Password) Change(tx *orm.Tx, uid int64, old, pass string) error {
	pp := &modelPassword{UID: uid}
	found, err := p.modelEngine(tx).Select(pp)
	if err != nil {
		return err
	}
	if !found {
		return fmt.Errorf("用户 %d 不存在", uid)
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
func (p *Password) Valid(identity, pass string) (int64, bool) {
	pp := &modelPassword{Identity: identity}
	found, err := p.modelEngine(nil).Select(pp)
	if err != nil {
		p.s.Logs().ERROR().Error(err)
		return 0, false
	}
	if !found {
		p.s.Logs().ERROR().Printf("用户 %s 不存在", identity)
		return 0, false
	}

	err = bcrypt.CompareHashAndPassword(pp.Password, []byte(pass))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return 0, false
	case err != nil:
		p.s.Logs().ERROR().Error(err)
		return 0, false
	default:
		return pp.UID, true
	}
}

func (p *Password) Identity(uid int64) (string, bool) {
	pp := &modelPassword{UID: uid}
	found, err := p.modelEngine(nil).Select(pp)
	if err != nil {
		p.s.Logs().ERROR().Error(err)
		return "", false
	}
	if !found {
		p.s.Logs().ERROR().Printf("用户 %d 不存在", uid)
		return "", false
	}

	return pp.Identity, true
}
