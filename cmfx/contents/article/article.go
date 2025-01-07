// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package article 文章管理
package article

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

const (
	topicsTableName = "topics"
	tagsTableName   = "tags"
)

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}
