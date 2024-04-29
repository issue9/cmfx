// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// Install 安装当前的环境
func Install(mod *cmfx.Module) {
	if err := mod.DB().Create(&User{}, &modelLog{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
