// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"database/sql"
	"time"

	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/query"
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

	// TODO

	return m
}

// New 添加新的文章
func (m *Module) New(tx *orm.Tx, slug string, a *Article) error {
	e := m.mod.Engine(tx)

	// TODO

	_, err := e.Insert(a.toPO())
	return err
}

func (m *Module) Set(tx *orm.Tx, a *Article) error {
	e := m.mod.Engine(tx)

	_, err := e.Insert(a.toPO())
	return err
}

func (m *Module) Get(id int64) (*Article, error) {
	// TODO
	return nil, nil
}

func (m *Module) GetBySlug(slug string) (*Article, error) {
	// TODO
	return nil, nil
}

// Delete 删除指定的文章
//
// id 为文章的 ID；
// t 为删除的时间；
// deleter 为删除者的 ID；
func (m *Module) Delete(tx *orm.Tx, id int64, t time.Time, deleter int64) error {
	po := &articlePO{
		ID:      id,
		Deleted: sql.NullTime{Valid: true, Time: t},
		Deleter: deleter,
	}

	_, err := m.mod.Engine(tx).Update(po)
	return err
}

type articlesQuery struct {
	query.Text
	Topic    []int64 `query:"topic"`
	Creator  []int64 `query:"creator"`
	Modifier []int64 `query:"modifier"`
	// TODO
}

func (m *Module) Articles(q *articlesQuery) (*query.Page[Article], error) {
	// TODO
	return nil, nil
}

// Topics 用到的主题分类
func (m *Module) Topics() *linkage.Module { return m.topics }

// Tags 用到的标签分类
func (m *Module) Tags() *tag.Module { return m.tags }
