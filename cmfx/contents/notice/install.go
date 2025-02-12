// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/relationship"
)

func Install(mod *cmfx.Module) *Module {
	tag.Install(mod, typesKey, "平台公告", "活动通知")
	tag.Install(mod, groupsKey)
	relationship.Install[int64, int64](mod, mod.ID()+"_notice_group")

	if err := mod.DB().Create(&noticePO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return Load(mod)
}
