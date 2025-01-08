// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import (
	"database/sql"
	"time"
)

type commentPO struct {
	ID       int64        `orm:"name(id);ai"`
	Author   string       `orm:"name(author);len(20)"`  // 显示的作者信息
	Content  string       `orm:"name(content);len(-1)"` // 文章内容
	Target   int64        `orm:"name(target)"`          // 关联对象的 ID
	Creator  int64        `orm:"name(creator)"`         // 作者 ID
	Rate     int          `orm:"name(rate)"`            // 评分
	Created  time.Time    `orm:"name(created)"`
	Modified time.Time    `orm:"name(modified)"`
	Deleted  sql.NullTime `orm:"name(deleted);nullable;default(NULL)"`
	Deleter  int64        `orm:"name(deleter)"`
	Parent   int64        `orm:"name(parent)"` // 父评论
}

func (*commentPO) TableName() string { return `_comments` }
