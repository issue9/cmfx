// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"database/sql"
	"html"
	"time"

	"github.com/issue9/cmfx/cmfx/types"
)

type articlePO struct {
	ID   int64  `orm:"name(id);ai"`
	Slug string `orm:"name(slug);len(100);unique(slug)"`

	Author string `orm:"name(author);len(20)"` // 显示的作者信息
	Views  int    `orm:"name(views)"`          // 查看数量
	Order  int    `orm:"name(order)"`          // 排序，按从小到大排序

	// 内容

	Title    string        `orm:"name(title);len(100)"`    // 标题
	Images   types.Strings `orm:"name(images);len(1000)"`  // 缩略图
	Keywords string        `orm:"name(keywords)"`          // 关键字
	Summary  string        `orm:"name(summary);len(2000)"` // 摘要
	Content  string        `orm:"name(content);len(-1)"`   // 文章内容

	// 分类信息

	Topics types.Int64s `orm:"name(topics)"`
	Tags   types.Int64s `orm:"name(tags)"`

	// 各类时间属性

	Created  time.Time    `orm:"name(created)"`
	Creator  int64        `orm:"name(creator)"`
	Modified time.Time    `orm:"name(modified)"`
	Modifier int64        `orm:"name(modifier)"`
	Deleted  sql.NullTime `orm:"name(deleted);nullable;default(NULL)"`
	Deleter  int64        `orm:"name(deleter)"`
	Version  int          `orm:"name(version);occ"` // TODO 每个版本保存为不同记录？如果分版本记录，不需要 Modifier 字段
}

func (*articlePO) TableName() string { return `_articles` }

func (l *articlePO) BeforeInsert() error {
	l.ID = 0
	l.Title = html.EscapeString(l.Title)
	l.Slug = html.EscapeString(l.Slug)
	l.Author = html.EscapeString(l.Author)
	l.Keywords = html.EscapeString(l.Keywords)
	l.Summary = html.EscapeString(l.Summary)
	l.Content = html.EscapeString(l.Content)

	l.Created = time.Now()
	l.Modified = l.Created

	return nil
}

func (l *articlePO) BeforeUpdate() error {
	l.Title = html.EscapeString(l.Title)
	l.Slug = html.EscapeString(l.Slug)
	l.Author = html.EscapeString(l.Author)
	l.Keywords = html.EscapeString(l.Keywords)
	l.Summary = html.EscapeString(l.Summary)
	l.Content = html.EscapeString(l.Content)

	l.Modified = time.Now()

	return nil
}

type Article struct {
	Slug            string
	Author          string
	Views           int
	Order           int
	Title           string
	Images          []string
	Keywords        string
	Summary         string
	Content         string
	Topics          []int64
	Tags            []int64
	CreatorModifier int64 // 添加时为创建者否则为修改者
}

func (a *Article) toPO() *articlePO {
	return &articlePO{
		Slug: a.Slug,

		Author: a.Author,
		Views:  a.Views,
		Order:  a.Order,

		// 内容

		Title:    a.Title,
		Images:   types.Strings(a.Images),
		Keywords: a.Keywords,
		Summary:  a.Summary,
		Content:  a.Content,

		// 分类信息

		Topics: types.Int64s(a.Topics),
		Tags:   types.Int64s(a.Tags),

		// 各类时间属性

		Creator:  a.CreatorModifier,
		Modifier: a.CreatorModifier,
	}
}
