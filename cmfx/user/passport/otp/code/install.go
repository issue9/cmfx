// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport/utils"
)

func Install(mod *cmfx.Module, tableName string) {
	db := utils.BuildDB(mod, tableName)
	if err := db.Create(&accountPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
