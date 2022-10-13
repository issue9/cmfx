// SPDX-License-Identifier: MIT

package passport

import (
	"fmt"

	"github.com/issue9/orm/v5"
)

type Func struct {
	t string
	p *Passport
	f func(username, password string) bool
}

// Func 以函数的方式验证账号密码
//
// f 用于验证账号和密码的正确性。
func (p *Passport) Func(t string, f func(string, string) bool) *Func {
	return &Func{
		t: t,
		p: p,
		f: f,
	}
}

// Add 添加账号
//
// 将 uid 与 username 作关联
func (p *Func) Add(tx *orm.Tx, uid int64, username string) error {
	db := p.p.modelEngine(tx)

	n, err := db.Where("username=?", username).
		And("{type}=?", p.t).
		Count(&code{})

	if err != nil {
		return err
	}
	if n > 0 {
		return ErrExists
	}

	_, err = db.Insert(&code{
		UID:      uid,
		Username: username,
		Type:     p.t,
	})
	return err
}

// Delete 删除关联信息
func (p *Func) Delete(tx *orm.Tx, uid int64) error {
	db := p.p.modelEngine(tx)

	_, err := db.Where("uid=?", uid).And("{type}=?", p.t).Delete(&code{})
	return err
}

// Valid 验证登录正确性并返回其 uid
func (p *Func) Valid(tx *orm.Tx, username, pass string) (int64, error) {
	if !p.f(username, pass) {
		return 0, ErrUnauthorized
	}

	db := p.p.modelEngine(tx)
	pp := &code{}
	n, err := db.Where("username=?", username).
		And("{type}=?", p.t).
		Select(true, pp)
	if err != nil {
		return 0, err
	}
	if n == 0 {
		return 0, fmt.Errorf("用户 %s 不存在", username)
	}

	return pp.UID, nil
}
