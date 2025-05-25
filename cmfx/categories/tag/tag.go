// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package tag 标签管理
package tag

import (
	"slices"

	"github.com/issue9/cache"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
)

// Tags 标签管理对象
type Tags struct {
	mod     *cmfx.Module
	db      *orm.DB
	cacheID string
}

func NewTags(mod *cmfx.Module, tableName string) *Tags {
	db := buildDB(mod, tableName)

	all := make([]*TagPO, 0, 10)
	if _, err := db.Where("true").Select(true, &all); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	cacheID := mod.Server().UniqueID()
	if err := mod.Server().Cache().Set(cacheID, all, cache.Forever); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return &Tags{
		mod:     mod,
		db:      db,
		cacheID: cacheID,
	}
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}

// Get 获得所有内容
func (m *Tags) Get() ([]*TagPO, error) {
	list := make([]*TagPO, 0, 10)
	if err := m.mod.Server().Cache().Get(m.cacheID, &list); err != nil {
		return nil, err
	}
	return list, nil
}

// Set 修改 id 指向的对象
func (m *Tags) Set(id int64, title string) error {
	list, err := m.Get()
	if err != nil {
		return err
	}

	index := slices.IndexFunc(list, func(e *TagPO) bool { return id == e.ID })
	if index >= 0 {
		list[index].Title = title
	}

	if _, err := m.db.Update(&TagPO{ID: id, Title: title}, "title"); err != nil {
		return err
	}

	// 保存到缓存
	return m.mod.Server().Cache().Set(m.cacheID, list, cache.Forever)
}

// Add 向 parent 添加一个或多个子项
func (m *Tags) Add(title ...string) error {
	list, err := m.Get()
	if err != nil {
		return err
	}

	for _, t := range title {
		id, err := m.db.LastInsertID(&TagPO{Title: t})
		if err != nil {
			return err
		}
		list = append(list, &TagPO{ID: id, Title: t})
	}

	return m.mod.Server().Cache().Set(m.cacheID, list, cache.Forever)
}

// Valid 验证 v 是否存在
func (m *Tags) Valid(v int64) bool {
	list, err := m.Get()
	if err != nil {
		m.mod.Server().Logs().ERROR().Error(err)
		return false
	}

	return slices.IndexFunc(list, func(e *TagPO) bool { return e.ID == v }) >= 0
}

func (m *Tags) Rule(name string, v *int64) (string, web.LocaleStringer) {
	return filter.V(m.Valid, locales.InvalidValue)(name, v)
}

func (m *Tags) SliceRule(name string, v *[]int64) (string, web.LocaleStringer) {
	return filter.SV[[]int64](m.Valid, locales.InvalidValue)(name, v)
}

func (m *Tags) Filter() filter.Builder[int64] {
	return filter.NewBuilder(m.Rule)
}

func (m *Tags) SliceFilter() filter.Builder[[]int64] {
	return filter.NewBuilder(m.SliceRule)
}
