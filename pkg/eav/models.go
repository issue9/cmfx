// SPDX-License-Identifier: MIT

package eav

type modelSimpleEAV struct {
	ID    int64  `orm:"name(id);unique(id)"` // 关联目标
	Value []byte `orm:"name(value);len(-1)"` // 关联的值
}

func (m *modelSimpleEAV) TableName() string { return `` }
