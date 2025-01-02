// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package linkage 提供简单的级联链表管理
package linkage

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}
