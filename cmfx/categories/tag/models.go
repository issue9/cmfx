// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

package tag

type TagPO struct {
	ID    int64  `orm:"name(id);ai" json:"id" yaml:"id" cbor:"id"`
	Title string `orm:"name(title);len(20)" json:"title" yaml:"title" cbor:"title"` // 此标签的简要说明
}

func (po *TagPO) TableName() string { return `` }
