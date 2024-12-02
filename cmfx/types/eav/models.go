// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package eav

type simpleEavPO struct {
	ID    int64  `orm:"name(id);unique(id)"` // 关联目标
	Value []byte `orm:"name(value);len(-1)"` // 关联的值
}

func (m *simpleEavPO) TableName() string { return `` }
