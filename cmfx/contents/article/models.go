// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"database/sql"
	"errors"
	"html"
	"time"

	"github.com/issue9/cmfx/cmfx/types"
)

// 文章快照的内容
type snapshotPO struct {
	ID       int64         `orm:"name(id);ai"`
	Article  int64         `orm:"name(article)"`           // 所属的文章 ID
	Author   string        `orm:"name(author);len(20)"`    // 显示的作者信息
	Title    string        `orm:"name(title);len(100)"`    // 标题
	Images   types.Strings `orm:"name(images);len(1000)"`  // 缩略图
	Keywords string        `orm:"name(keywords)"`          // 关键字
	Summary  string        `orm:"name(summary);len(2000)"` // 摘要
	Content  string        `orm:"name(content);len(-1)"`   // 文章内容
	Created  time.Time     `orm:"name(created)"`
	Creator  int64         `orm:"name(creator)"`
}

type articlePO struct {
	ID    int64  `orm:"name(id);ai"`
	Slug  string `orm:"name(slug);len(200);unique(slug)"`
	Last  int64  `orm:"name(last)"`  // 最后一次的快照 ID
	Views int    `orm:"name(views)"` // 查看数量
	Order int    `orm:"name(order)"` // 排序，按从小到大排序

	Created  time.Time    `orm:"name(created)"`
	Creator  int64        `orm:"name(creator)"`
	Modified time.Time    `orm:"name(modified)"`
	Modifier int64        `orm:"name(modifier)"`
	Deleted  sql.NullTime `orm:"name(deleted);nullable"`
	Deleter  int64        `orm:"name(deleter)"`
}

func (*snapshotPO) TableName() string { return `_article_snapshots` }

func (l *snapshotPO) BeforeInsert() error {
	l.ID = 0
	l.Title = html.EscapeString(l.Title)
	l.Author = html.EscapeString(l.Author)
	l.Keywords = html.EscapeString(l.Keywords)
	l.Created = time.Now()

	return nil
}

func (l *snapshotPO) BeforeUpdate() error {
	return errors.New("快照不会执行更新操作")
}

func (*articlePO) TableName() string { return `_articles` }

func (l *articlePO) BeforeInsert() error {
	l.ID = 0
	l.Created = time.Now()

	return nil
}

func (l *articlePO) BeforeUpdate() error {
	l.Modified = time.Now()
	return nil
}
