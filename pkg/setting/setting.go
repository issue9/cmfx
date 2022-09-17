// SPDX-License-Identifier: MIT

// Package setting 设置项管理
package setting

import "github.com/issue9/orm/v5"

const (
	TypeBool   = "bool"
	TypeNumber = "number"
	TypeString = "string"
)

// NOTE: 如果有按用户进行设置的需求，不如直接建表方便。

// Setting 设置项
//
// 所有的设置以结构体为单位保存在数据库，
// 每个结构体可以有多个基本字段。
type Setting struct {
	db       *orm.DB
	dbPrefix orm.Prefix
	groups   map[string]*Group
}

func New(mod string, db *orm.DB) *Setting {
	return &Setting{
		db:       db,
		dbPrefix: orm.Prefix(mod),
		groups:   make(map[string]*Group, 5),
	}
}
