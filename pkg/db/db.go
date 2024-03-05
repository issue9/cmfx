// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package db 数据库相关操作
package db

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/types"
)

type (
	Int64s  = types.SliceOf[int64]
	Strings = types.SliceOf[string]

	Prefix      = orm.Prefix
	Tx          = orm.Tx
	DB          = orm.DB
	ModelEngine = orm.ModelEngine
)
