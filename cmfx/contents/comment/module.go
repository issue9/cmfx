// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

type Module struct {
	mod *cmfx.Module
	db  *orm.DB
}

func Load(mod *cmfx.Module, tablePrefix string) *Module {
	m := &Module{
		mod: mod,
		db:  buildDB(mod, tablePrefix),
	}

	return m
}
