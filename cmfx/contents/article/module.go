// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/relationship"
)

type Module struct {
	db       *orm.DB
	mod      *cmfx.Module
	topics   *linkage.Module
	tags     *tag.Module
	topicRel *relationship.Module[int64, int64] // 主题与文章的关联，0 文章，1 主题
	tagRel   *relationship.Module[int64, int64] // 标签与文章的关联，0 文章，1 标签
}

// Load 加载内容管理模块
//
// tablePrefix 其它表都以此作为表名前缀；
// mod 所属的模块；
func Load(mod *cmfx.Module, tablePrefix string) *Module {
	m := &Module{
		db:       buildDB(mod, tablePrefix),
		mod:      mod,
		topics:   linkage.Load(mod, tablePrefix+"_"+topicsTableName),
		tags:     tag.Load(mod, tablePrefix+"_"+tagsTableName),
		topicRel: relationship.Load[int64, int64](mod, tablePrefix+"_article_topic"),
		tagRel:   relationship.Load[int64, int64](mod, tablePrefix+"_article_tag"),
	}

	return m
}

// Topics 用到的主题分类
func (m *Module) Topics() *linkage.Module { return m.topics }

// Tags 用到的标签分类
func (m *Module) Tags() *tag.Module { return m.tags }
