// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import "database/sql"

type linkagePO struct {
	ID      int64        `orm:"name(id);ai"`
	Title   string       `orm:"name(title);len(20)"`           // 此分类的简要说明
	Icon    string       `orm:"name(icon);len(1024);nullable"` // 图标
	Deleted sql.NullTime `orm:"name(deleted);nullable"`        // 删除时间
	Parent  int64        `orm:"name(parent)"`                  // 表示某一项的上一级项目，如果为零，表示该值是顶级项目。
}

func (l *linkagePO) TableName() string { return `` }

type LinkageVO struct {
	ID    int64        `json:"id" yaml:"id" cbor:"id" xml:"id,attr"`
	Title string       `json:"title" yaml:"title" cbor:"title" xml:"title"`
	Icon  string       `json:"icon,omitempty" yaml:"icon,omitempty" cbor:"icon,omitempty" xml:"icon,omitempty"`
	Items []*LinkageVO `json:"items,omitempty" yaml:"items,omitempty" cbor:"items,omitempty" xml:"items>item,omitempty"`
}

func (vo *LinkageVO) toPO(parent int64) *linkagePO {
	return &linkagePO{
		Parent: parent,
		Title:  vo.Title,
		Icon:   vo.Icon,
	}
}
