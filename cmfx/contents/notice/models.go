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
	ID int64  `orm:"name(id);ai"`
	NO string `orm:"name(no);unique(no)"`

	Created time.Time    `orm:"name(created)"`
	Creator int64        `orm:"name(creator)"` // 作者 ID
	Expired sql.NullTime `orm:"name(expired);nullable"`
	All     bool         `orm:"name(all)"` // 0 表示所有用户，在未过期的情况下，后添加用户也可读取此记录。
	Type    int64        `orm:"name(type)"`

	Author  string `orm:"name(author);len(50)"`
	Title   string `orm:"name(title);len(1000)"`
	Content string `orm:"name(content);len(-1)"`
}

func (p *noticePO) TableName() string { return "_notices" }

type groupPO struct {
	UID  int64        `orm:"name(uid);unique(uid_nid)"`
	NID  int64        `orm:"name(nid);unique(uid_nid)"`
	Read sql.NullTime `orm:"name(read);nullable"` // 是否已读
}

func (p *groupPO) TableName() string { return "_notice_groups" }
