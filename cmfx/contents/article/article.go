// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package article 文章管理
package article

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/relationship"
)

const (
	topicsTableName = "topics"
	tagsTableName   = "tags"
)

// Articles 提供文章内容管理模块
type Articles struct {
	db       *orm.DB
	mod      *cmfx.Module
	topics   *linkage.Linkages
	tags     *tag.Tags
	topicRel *relationship.Relationships[int64, int64] // 主题与文章的关联，0 文章，1 主题
	tagRel   *relationship.Relationships[int64, int64] // 标签与文章的关联，0 文章，1 标签
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}

// NewArticles 声明 [Articles] 对象
//
// mod 所属的模块；
// tablePrefix 其它表都以此作为表名前缀；
func NewArticles(mod *cmfx.Module, tablePrefix string) *Articles {
	m := &Articles{
		db:       buildDB(mod, tablePrefix),
		mod:      mod,
		topics:   linkage.NewLinkages(mod, tablePrefix+"_"+topicsTableName),
		tags:     tag.NewTags(mod, tablePrefix+"_"+tagsTableName),
		topicRel: relationship.NewRelationships[int64, int64](mod, tablePrefix+"_article_topic"),
		tagRel:   relationship.NewRelationships[int64, int64](mod, tablePrefix+"_article_tag"),
	}

	return m
}

// Topics 用到的主题分类
func (m *Articles) Topics() *linkage.Linkages { return m.topics }

// Tags 用到的标签分类
func (m *Articles) Tags() *tag.Tags { return m.tags }
