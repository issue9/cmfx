// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
)

// Module 表示功能相对独立的模块
type Module interface {
	// ID 模块的唯一 ID
	ID() string

	// Desc 对该模块的描述
	Desc() web.LocaleStringer

	// Server 关联的 [web.Server] 对象
	Server() web.Server

	// DB 关联的数据库对象
	DB() *orm.DB

	// DBPrefix 根据 [Module.ID] 生成的 [orm.Prefix]
	DBPrefix() orm.Prefix

	// DBEngine 返回 [orm.ModelEngine] 对象
	//
	// 如果 tx 为 nil，则采用 [Module.DB] 构建
	DBEngine(*orm.Tx) orm.ModelEngine

	// New 基于当前模块的 ID 声明一个新的实例
	New(string, web.LocaleStringer) Module

	// Cache 缓存系统
	Cache() web.Cache

	// Router 关联的路由
	Router() *web.Router
}

type module struct {
	id   string
	desc web.LocaleStringer
	s    web.Server

	r      *web.Router
	db     *orm.DB
	prefix orm.Prefix
	cache  web.Cache
}

// NewModule 提供了默认的 [Module] 实现
func NewModule(id string, desc web.LocaleStringer, s web.Server, db *orm.DB, r *web.Router) Module {
	return &module{
		id:   id,
		desc: desc,
		s:    s,

		r:      r,
		db:     db,
		prefix: orm.Prefix(id),
		cache:  web.NewCache(id, s.Cache()),
	}
}

func (m *module) ID() string { return m.id }

func (m *module) Desc() web.LocaleStringer { return m.desc }

func (m *module) Server() web.Server { return m.s }

func (m *module) DB() *orm.DB { return m.db }

func (m *module) DBPrefix() orm.Prefix { return m.prefix }

func (m *module) DBEngine(tx *orm.Tx) orm.ModelEngine {
	if tx == nil {
		return m.DBPrefix().DB(m.DB())
	}
	return m.DBPrefix().Tx(tx)
}

func (m *module) Router() *web.Router { return m.r }

func (m *module) New(id string, desc web.LocaleStringer) Module {
	return NewModule(m.ID()+id, desc, m.Server(), m.DB(), m.Router())
}

func (m *module) Cache() web.Cache { return m.cache }
