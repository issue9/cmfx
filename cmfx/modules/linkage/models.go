// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import "database/sql"

type modelLinkage struct {
	ID      int64        `orm:"name(id);ai"`
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
	Data    []byte       `orm:"name(data);len(-1)"` // 数据，JSON 格式。

	// Key 表示一个分类的关联键，同一分类下的不同子级都是相同中的值；
	Key string `orm:"name(key);len(20)"`
	// Parent 表示某一项的上一级项目，如果为零，表示该值是顶级项目。
	Parent int64 `orm:"name(parent)"`
}

func (l *modelLinkage) TableName() string { return `_linkages` }
