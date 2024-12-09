// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/user"
)

// Install 安装当前的环境
func Install(mod *user.Module, id string) {
	db := buildDB(mod.Module().DB(), id)

	if err := db.Create(&overviewPO{}, &expirePO{}, &logPO{}); err != nil {
		panic(web.SprintError(mod.Module().Server().Locale().Printer(), true, err))
	}
}
