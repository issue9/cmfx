// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package product

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/relationship/eav"
)

// Install 安装数据
func Install(mod *cmfx.Module, prefix string) *Module {
	db := buildDB(mod, prefix)

	if err := db.Create(&snapshotPO{}, &productPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	eav.Install(mod, prefix)

	return Load(mod, prefix)
}
