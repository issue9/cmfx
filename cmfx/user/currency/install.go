// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/user"
)

// Install 安装当前的环境
func Install(mod *user.Users, id string) *Currency {
	db := buildDB(mod.Module().DB(), id)

	if err := db.Create(&overviewPO{}, &expirePO{}, &LogPO{}); err != nil {
		panic(web.SprintError(mod.Module().Server().Locale().Printer(), true, err))
	}

	return New(mod, id)
}
