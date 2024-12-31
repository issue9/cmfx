// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package tags

type TagPO struct {
	XMLName struct{} `orm:"-" json:"-" yaml:"-" cbor:"-" xml:"tag"`

	ID    int64  `orm:"name(id);ai" json:"id" yaml:"id" cbor:"id" xml:"id,attr"`
	Title string `orm:"name(title);len(20)" json:"title" yaml:"title" cbor:"title" xml:"title"` // 此标签的简要说明
}

func (po *TagPO) TableName() string { return `` }
