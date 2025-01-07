// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
)

type Module struct {
	db     *orm.DB
	mod    *cmfx.Module
	topics *linkage.Module
	tags   *tag.Module
}

// Load 加载内容管理模块
func Load(mod *cmfx.Module, tableName string) *Module {
	m := &Module{
		db:     buildDB(mod, tableName),
		mod:    mod,
		topics: linkage.Load(mod, topicsTableName),
		tags:   tag.Load(mod, tagsTableName),
	}

	return m
}

// Topics 用到的主题分类
func (m *Module) Topics() *linkage.Module { return m.topics }

// Tags 用到的标签分类
func (m *Module) Tags() *tag.Module { return m.tags }
