// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package tags 标签管理
package tags

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_tags_" + tableName)
}
