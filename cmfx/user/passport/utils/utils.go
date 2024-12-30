// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package utils 提供 passport 的一些工具
package utils

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

// BuildDB 根据表名生成 [orm.DB] 对象
func BuildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_auth_" + tableName)
}
