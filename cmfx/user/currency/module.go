// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx/user"
)

type Module struct {
	user *user.Module
	id   string
	db   *orm.DB
}

// Load 加载模块
//
// u 所属的模块；
// id 该货币的 ID；
func Load(u *user.Module, id string) *Module {
	m := &Module{
		user: u,
		id:   id,
		db:   buildDB(u.Module().DB(), id),
	}

	u.OnAdd(func(u *user.User) { m.initOverview(nil, u.ID) }) // 添加用户时创建一个关联的初始表

	return m
}

func (m *Module) initOverview(tx *orm.Tx, u int64) *overviewPO {
	e := m.engine(tx)

	id, err := e.LastInsertID(&overviewPO{UID: u})
	if err != nil {
		m.user.Module().Server().Logs().ERROR().Error(err)
	}

	return &overviewPO{ID: id, UID: u}
}

func buildDB(db *orm.DB, id string) *orm.DB {
	return db.New(db.TablePrefix() + "_" + id)
}

func (m *Module) engine(tx *orm.Tx) orm.Engine {
	if tx == nil {
		return m.db
	}
	return tx.NewEngine(m.db.TablePrefix())
}
