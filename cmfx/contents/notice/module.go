// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"iter"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/user"
)

// Filter 提供了对现有用户进行过滤的方法
type Filter interface {
	// Desc 对当前过滤器的描述
	Desc() web.LocaleStringer

	// Users 返回当前分组下的用户 ID
	Users() iter.Seq[int64]
}

type Module struct {
	types   *tag.Module // 通知类型
	user    *user.Module
	filters map[string]Filter
}

// Load 加载模块
func Load(user *user.Module) *Module {
	return &Module{
		types:   tag.Load(user.Module(), typesKey),
		user:    user,
		filters: make(map[string]Filter, 5),
	}
}

// Types 通知类型操作接口
func (m *Module) Types() *tag.Module { return m.types }

// RegisterFilter 注册 [Filter] 对象
func (m *Module) RegisterFilter(name string, g Filter) error {
	if _, found := m.filters[name]; found {
		return locales.ErrNotFound()
	}

	m.filters[name] = g
	return nil
}
