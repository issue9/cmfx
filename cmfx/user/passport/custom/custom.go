// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package custom 自定义验证方法
package custom

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

type Func struct {
	s  web.Server
	db *orm.DB
	f  func(username, password string) bool
}

// Func 以函数的方式验证账号密码
//
// tableName 表名，可参考 email、oauth 等命名，_auth_xx 的方式；
// f 用于验证账号和密码的正确性；
func New(mod *cmfx.Module, tableName string, f func(string, string) bool) *Func {
	return &Func{
		s:  mod.Server(),
		db: mod.DB().New(mod.DB().TablePrefix() + tableName),
		f:  f,
	}
}

func (p *Func) modelEngine(tx *orm.Tx) orm.Engine {
	if tx == nil {
		return p.db
	} else {
		return tx.NewEngine(p.db.TablePrefix())
	}
}

// Add 添加账号
//
// 将 uid 与 identity 作关联
func (p *Func) Add(tx *orm.Tx, uid int64, identity string) error {
	db := p.modelEngine(tx)

	n, err := db.Where("identity=?", identity).Count(&modelCustom{})
	if err != nil {
		return err
	}
	if n > 0 {
		return passport.ErrExists()
	}

	_, err = db.Insert(&modelCustom{
		UID:      uid,
		Identity: identity,
	})
	return err
}

// Delete 删除关联信息
func (p *Func) Delete(tx *orm.Tx, uid int64) error {
	_, err := p.modelEngine(tx).Delete(&modelCustom{UID: uid})
	return err
}

// Valid 验证登录正确性并返回其 uid
func (p *Func) Valid(identity, pass string) (int64, string, bool) {
	if !p.f(identity, pass) {
		return 0, "", false
	}

	pp := &modelCustom{Identity: identity}
	found, err := p.modelEngine(nil).Select(pp)
	if err != nil {
		p.s.Logs().ERROR().Error(err)
		return 0, "", false
	}
	if !found {
		return 0, identity, false
	}

	return pp.UID, "", true
}

func (p *Func) Identity(uid int64) (string, bool) {
	pp := &modelCustom{UID: uid}
	found, err := p.modelEngine(nil).Select(pp)
	if err != nil {
		p.s.Logs().ERROR().Error(err)
		return "", false
	}
	if !found {
		return "", false
	}

	return pp.Identity, true
}
