// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package product 商品类的内容
package product

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}
