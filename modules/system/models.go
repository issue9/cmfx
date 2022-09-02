// SPDX-License-Identifier: MIT

package system

import (
	"database/sql"
	"html"
)

type linkage struct {
	ID      int64        `orm:"name(id);ai"`
	Name    string       `orm:"name(name);len(100)"`
	Parent  int64        `orm:"name(parent)"` // 上一级分类，若不存在，则为 0
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (l *linkage) TableName() string { return `_linkages` }

func (l *linkage) BeforeInsert() error {
	l.Name = html.EscapeString(l.Name)
	return nil
}
