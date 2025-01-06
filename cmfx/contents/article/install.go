// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/categories/tag"
)

func Install(mod *cmfx.Module, ts ...string) {
	linkage.Install(mod, topicsTableName, &linkage.Linkage{})
	tag.Install(mod, tagsTableName, ts...)

	if err := mod.DB().Create(&articlePO{}, &articleSnapshotPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
