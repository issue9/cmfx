// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"database/sql"
	"time"
)

// 通知内容
type noticePO struct {
	ID int64 `orm:"name(id);ai"`

	Created time.Time    `orm:"name(created)"`
	Creator int64        `orm:"name(creator)"` // 作者 ID
	Expired sql.NullTime `orm:"name(expired)"`
	Group   int64        `orm:"name(group)"` // 0 表示所有用户
	Type    int64        `orm:"name(type)"`
	Read    bool         `orm:"name(read)"` // 当关联所有的用户都已读，则此标记为 true，同时关系表中的所有项可以删除。

	Author  string `orm:"name(author);len(50)"`
	Title   string `orm:"name(title);len(1000)"`
	Content string `orm:"name(content);len(-1)"`
}

func (p *noticePO) TableName() string { return "_notices" }
