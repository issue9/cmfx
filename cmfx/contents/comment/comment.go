// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

// Comments 评论管理
type Comments struct {
	mod *cmfx.Module
	db  *orm.DB
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}

func NewComments(mod *cmfx.Module, tablePrefix string) *Comments {
	m := &Comments{
		mod: mod,
		db:  buildDB(mod, tablePrefix),
	}

	return m
}
