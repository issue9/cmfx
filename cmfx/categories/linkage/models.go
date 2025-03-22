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
	Order   int          `orm:"name(order)"`                   // 在同级中的顺序
	Parent  int64        `orm:"name(parent)"`                  // 表示某一项的上一级项目，如果为零，表示该值是顶级项目。
	Count   int          `orm:"name(count)"`                   // 关联内容的数量
}

func (l *linkagePO) TableName() string { return `` }

type Linkage struct {
	XMLName struct{} `json:"-" yaml:"-" cbor:"-" toml:"-" xml:"linkage"`

	ID    int64      `json:"id" yaml:"id" cbor:"id" toml:"id" xml:"id,attr"`
	Title string     `json:"title" yaml:"title" cbor:"title" toml:"title" xml:"title"`
	Order int        `json:"order,omitempty" yaml:"order,omitempty" cbor:"order,omitempty" toml:"order,omitempty" xml:"order,attr,omitempty"` // 在同级中的顺序
	Icon  string     `json:"icon,omitempty" yaml:"icon,omitempty" cbor:"icon,omitempty" toml:"icon,omitempty" xml:"icon,omitempty"`
	Items []*Linkage `json:"items,omitempty" yaml:"items,omitempty" cbor:"items,omitempty" toml:"items,omitempty" xml:"items>item,omitempty"`
	Count int        `json:"count,omitempty" yaml:"count,omitempty" cbor:"count,omitempty" toml:"count,omitempty" xml:"count,attr,omitempty"` // 关联内容的数量
}

func (vo *Linkage) toPO(parent int64) *linkagePO {
	return &linkagePO{
		Parent: parent,
		Title:  vo.Title,
		Icon:   vo.Icon,
		Order:  vo.Order,
		Count:  vo.Count,
	}
}
