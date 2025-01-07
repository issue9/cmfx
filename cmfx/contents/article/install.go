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

func Install(mod *cmfx.Module, tableName string, ts ...string) {
	linkage.Install(mod, tableName+"_"+topicsTableName, &linkage.Linkage{})
	tag.Install(mod, tableName+"_"+tagsTableName, ts...)

	db := buildDB(mod, tableName)
	if err := db.Create(&snapshotPO{}, &articlePO{}, &tagRelationPO{}, &topicRelationPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}
