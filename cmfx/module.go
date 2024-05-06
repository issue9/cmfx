// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	"fmt"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
)

const moduleContextValue moduleContextType = 0

type moduleContextType int

// Module 表示代码模块的基本信息
type Module struct {
	id   string
	desc web.LocaleStringer
	s    web.Server
	db   *orm.DB
	r    *web.Router
}

func NewModule(id string, desc web.LocaleStringer, s web.Server, db *orm.DB, r *web.Router) *Module {
	// 防止重复的 id 值
	m, loaded := s.Vars().LoadOrStore(moduleContextValue, map[string]struct{}{id: {}})
	if loaded {
		mm := m.(map[string]struct{})
		if _, found := mm[id]; found {
			panic(fmt.Sprintf("存在相同 id 的模块：%s\n", id))
		} else {
			mm[id] = struct{}{}
			s.Vars().Store(moduleContextValue, mm)
		}
	}

	return &Module{
		id:   id,
		desc: desc,
		s:    s,
		db:   db.New(id),
		r:    r,
	}
}

// ID 模块的唯一 ID
func (m *Module) ID() string { return m.id }

// Desc 对该模块的描述
func (m *Module) Desc() web.LocaleStringer { return m.desc }

// Server 关联的 [web.Server] 对象
func (m *Module) Server() web.Server { return m.s }

// DB 以当前数据库作为表名前缀的操作接口
func (m *Module) DB() *orm.DB { return m.db }

func (m *Module) Engine(tx *orm.Tx) orm.Engine {
	if tx == nil {
		return m.DB()
	}
	return tx.NewEngine(m.db.TablePrefix())
}

// New 基于当前模块的 ID 声明一个新的实例
func (m *Module) New(id string, desc web.LocaleStringer) *Module {
	return NewModule(m.ID()+id, desc, m.Server(), m.DB(), m.Router())
}

func (m *Module) Router() *web.Router { return m.r }
