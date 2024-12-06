// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/user"
)

func Install(mod *cmfx.Module, o *Config, up *upload.Module) {
	user.Install(mod)

	if err := mod.DB().Create(&infoPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
