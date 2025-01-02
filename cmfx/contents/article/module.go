// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
)

type Module struct {
	mod    *cmfx.Module
	topics *linkage.Module
	tags   *tag.Module
}

// Load 加载内容管理模块
func Load(mod *cmfx.Module, u *user.Module) *Module {
	m := &Module{
		mod:    mod,
		topics: linkage.Load(mod, topicsTableName),
		tags:   tag.Load(mod, tagsTableName),
	}

	// TODO

	return m
}

// New 添加新的文章
func (m *Module) New(tx *orm.Tx, a *Article) error {
	e := m.mod.Engine(tx)

	_, err := e.Insert(a.toPO())
	return err
}

type articlesQuery struct {
	query.Text
	Topic   []int64 `json:"topic"`
	Creator []int64 `json:"creator"`
}

func (m *Module) Articles(q *articlesQuery) (query.Page[Article], error) {
	// TODO
}

// Topics 用到的主题分类
func (m *Module) Topics() *linkage.Module { return m.topics }

// Tags 用到的标签分类
func (m *Module) Tags() *tag.Module { return m.tags }
