// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package settings 与用户关联的设置信息
package settings

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
)

type Settings struct {
	db        *orm.DB
	objects   []string
	presetUID int64
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}

// New 声明一张用于保存设置项的表
//
// tableName 为表名的后缀；
// presetUID 默认用户的 id，该用户的的设置总是存在，当其它用户不存在设置项，会采用该用户的设置项作为默认值。
func New(mod *cmfx.Module, tableName string) *Settings {
	return &Settings{
		db:        buildDB(mod, tableName),
		objects:   make([]string, 0, 10),
		presetUID: user.SpecialUserID,
	}
}
