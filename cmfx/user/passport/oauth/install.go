// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package oauth

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func Install(mod cmfx.Module) {
	if err := mod.DB().Create(&modelOAuth{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
