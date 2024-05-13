// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"database/sql"
	"time"
)

//------------------------------------- health ---------------------------------------

type modelHealth struct {
	Route        string        `orm:"name(route);len(100);unique(r_m_p)"`
	Method       string        `orm:"name(method);len(10);unique(r_m_p)"`
	Pattern      string        `orm:"name(pattern);len(1024);unique(r_m_p)"`
	Min          time.Duration `orm:"name(min)"`
	Max          time.Duration `orm:"name(max)"`
	Count        int           `orm:"name(count)"`
	UserErrors   int           `orm:"name(user_errors)"`
	ServerErrors int           `orm:"name(server_errors)"`
	Last         time.Time     `orm:"name(last)"`
	Spend        time.Duration `orm:"name(spend)"`
}

func (l *modelHealth) TableName() string { return `_api_healths` }

func (l *modelHealth) BeforeUpdate() error {
	l.Last = time.Now()
	return nil
}

//------------------------------------- linkage ---------------------------------------

type modelLinkage struct {
	ID      int64        `orm:"name(id);ai"`
	Key     string       `orm:"name(key);len(20)"`           // 此分类的唯一关键字
	Title   string       `orm:"name(title);len(20)"`         // 此分类的简要说明
	Deleted sql.NullTime `orm:"name(deleted);nullable"`      // 删除时间
	Data    []byte       `orm:"name(data);len(-1);nullable"` // 扩展数据，JSON 格式。
	Parent  int64        `orm:"name(parent)"`                // 表示某一项的上一级项目，如果为零，表示该值是顶级项目。
}

func (l *modelLinkage) TableName() string { return `_linkages` }
