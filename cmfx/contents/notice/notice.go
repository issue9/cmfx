// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package notice 提供站内通知等功能
package notice

import (
	"iter"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/user"
)

const (
	typesKey = "notice_types"
)

// Filter 提供了对现有用户进行过滤的方法
type Filter interface {
	// Desc 对当前过滤器的描述
	Desc() web.LocaleStringer

	// Users 返回当前分组下的用户 ID
	Users() iter.Seq[int64]
}

// Notices 提供了通知管理功能
type Notices struct {
	types   *tag.Tags // 通知类型
	user    *user.Users
	filters map[string]Filter
}

// NewNotices 声明 [Notices] 对象
//
// user 接收此信息的用户系统；
func NewNotices(user *user.Users) *Notices {
	return &Notices{
		types:   tag.NewTags(user.Module(), typesKey),
		user:    user,
		filters: make(map[string]Filter, 5),
	}
}

// Types 通知类型操作接口
func (m *Notices) Types() *tag.Tags { return m.types }

// RegisterFilter 注册 [Filter] 对象
func (m *Notices) RegisterFilter(name string, g Filter) error {
	if _, found := m.filters[name]; found {
		return locales.ErrNotFound()
	}

	m.filters[name] = g
	return nil
}
