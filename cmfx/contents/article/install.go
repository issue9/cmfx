// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
)

func Install(mod *cmfx.Module) {
	linkage.Install(mod, topicsTableName, &linkage.LinkageVO{})

	if err := mod.DB().Create(&articlePO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
