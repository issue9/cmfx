// SPDX-License-Identifier: MIT

package system

import (
	"database/sql"
	"html"
	"time"
)

type healthModel struct {
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

type linkage struct {
	ID      int64        `orm:"name(id);ai"`
	Name    string       `orm:"name(name);len(100)"`
	Parent  int64        `orm:"name(parent)"` // 上一级分类，若不存在，则为 0
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (l *healthModel) TableName() string { return `_api_health` }

func (l *healthModel) BeforeUpdate() error {
	l.Last = time.Now()
	return nil
}

func (l *linkage) TableName() string { return `_linkages` }

func (l *linkage) BeforeInsert() error {
	l.Name = html.EscapeString(l.Name)
	return nil
}
