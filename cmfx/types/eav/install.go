// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// InstallSimple 安装简单的 EAV 数据表
//
// tableName 为表名；
func InstallSimple(mod *cmfx.Module, tableName string) {
	db := mod.DB().New(mod.DB().TablePrefix() + tableName)
	if err := db.Create(&modelSimpleEAV{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
