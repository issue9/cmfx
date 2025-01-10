// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"time"

	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

type ValueType interface {
	~int64 | ~string | time.Time | *time.Time | ~float64
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}
