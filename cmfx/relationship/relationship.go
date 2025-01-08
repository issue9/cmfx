// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package relationship 用于处理多对多的数据表关系
package relationship

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

// T 限制了可用的字段类型
type T interface {
	~string | ~int | ~int64
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}
