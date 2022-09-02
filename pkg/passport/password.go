// SPDX-License-Identifier: MIT

package passport

import (
	"errors"
	"fmt"

	"github.com/issue9/orm/v5"
	"golang.org/x/crypto/bcrypt"
)

type Password struct {
	passport *Passport
	t        string
}

// Password 返回处理密码登录的对象
//
// t 表示类型，比如同一个用户可能有登录密码和支付密码等，那么通过 t 可以区分这些密码。
func (p *Passport) Password(t string) *Password {
	return &Password{
		passport: p,
		t:        t,
	}
}

// Add 添加账号
//
// 如果 tx 为空，那么将采用 orm.DB 访问数据库。
func (p *Password) Add(tx *orm.Tx, uid int64, username, pass string) error {
	db := p.passport.modelEngine(tx)

	n, err := db.Where("username=?", username).
		And("{type}=?", p.t).
		Count(&password{})

	if err != nil {
		return err
	}
	if n > 0 {
		return ErrExists
	}

	pa, err := bcrypt.GenerateFromPassword([]byte(pass), defaultCost)
	if err != nil {
		return err
	}
	_, err = db.Insert(&password{
		UID:      uid,
		Username: username,
		Password: pa,
		Type:     p.t,
	})
	return err
}

// Delete 删除关联的密码信息
func (p *Password) Delete(tx *orm.Tx, uid int64) error {
	db := p.passport.modelEngine(tx)

	_, err := db.Where("uid=?", uid).
		And("{type}=?", p.t).
		Delete(&password{})
	return err
}

// Set 修改密码
func (p *Password) Set(tx *orm.Tx, uid int64, pass string) error {
	pa, err := bcrypt.GenerateFromPassword([]byte(pass), defaultCost)
	if err != nil {
		return err
	}

	db := p.passport.modelEngine(tx)
	_, err = db.Where("uid=?", uid).
		And("{type}=?", p.t).
		Update(&password{
			Password: pa,
		})
	return err
}

func (p *Password) Change(tx *orm.Tx, uid int64, old, pass string) error {
	db := p.passport.modelEngine(tx)

	pp := &password{}
	n, err := db.Where("uid=?", uid).
		And("{type}=?", p.t).
		Select(true, pp)
	if err != nil {
		return err
	}
	if n == 0 {
		return fmt.Errorf("用户 %d 不存在", uid)
	}

	err = bcrypt.CompareHashAndPassword(pp.Password, []byte(old))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return ErrUnauthorized
	case err != nil:
		return err
	default:
		return p.Set(tx, uid, pass)
	}
}

// Valid 验证登录正确性并返回其 uid
func (p *Password) Valid(tx *orm.Tx, username, pass string) (int64, error) {
	db := p.passport.modelEngine(tx)

	pp := &password{}
	n, err := db.Where("username=?", username).
		And("{type}=?", p.t).
		Select(true, pp)
	if err != nil {
		return 0, err
	}
	if n == 0 {
		return 0, fmt.Errorf("用户 %s 不存在", username)
	}

	err = bcrypt.CompareHashAndPassword(pp.Password, []byte(pass))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return 0, ErrUnauthorized
	case err != nil:
		return 0, err
	default:
		return pp.UID, nil
	}
}
