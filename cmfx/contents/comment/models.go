// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import (
	"database/sql"
	"errors"
	"html"
	"time"
)

// 不需要生成 sql 相关的方法，SQL 对可阅读性并不需要太高，直接用数据就可以了。
//go:generate web enum -i=./models.go -o=./models_enums.go -t=State -sql=false

type State int8

const (
	StateVisible State = iota // 显示
	StateHidden               // 隐藏
	StateTop                  // 置顶
)

// 评论的快照
type snapshotPO struct {
	Comment int64     `orm:"name(comment)"`
	ID      int64     `orm:"name(id);ai"`
	Content string    `orm:"name(content);len(-1)"` // 文章内容
	Rate    int       `orm:"name(rate)"`            // 评分
	Created time.Time `orm:"name(created)"`
}

type commentPO struct {
	ID       int64        `orm:"name(id);ai"`
	State    State        `orm:"name(state)"`
	Last     int64        `orm:"name(last)"`           // 最后一次的快照 ID
	Author   string       `orm:"name(author);len(20)"` // 显示的作者信息
	Target   int64        `orm:"name(target)"`         // 被评论的对象
	Parent   int64        `orm:"name(parent)"`         // 父评论
	Creator  int64        `orm:"name(creator)"`        // 作者 ID
	Created  time.Time    `orm:"name(created)"`
	Modified time.Time    `orm:"name(modified)"`
	Deleted  sql.NullTime `orm:"name(deleted);nullable"`
}

func (*snapshotPO) TableName() string { return `_comment_snapshots` }

func (l *snapshotPO) BeforeUpdate() error {
	return errors.New("快照不会执行更新操作")
}

func (*commentPO) TableName() string { return `_comments` }

func (l *commentPO) BeforeInsert() error {
	l.Author = html.EscapeString(l.Author)
	return nil
}

func (l *commentPO) BeforeUpdate() error {
	l.Author = html.EscapeString(l.Author)
	return nil
}
