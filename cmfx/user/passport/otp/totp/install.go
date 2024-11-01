// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package totp

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func Install(mod *cmfx.Module, tableName string) {
	db := buildDB(mod, tableName)
	if err := db.Create(&modelTOTP{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
