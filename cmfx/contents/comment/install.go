// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// Install 安装数据
//
// mod 所属模块；tablePrefix 表名前缀；
func Install(mod *cmfx.Module, tablePrefix string) *Module {
	db := buildDB(mod, tablePrefix)
	if err := db.Create(&snapshotPO{}, &commentPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return Load(mod, tablePrefix)
}
