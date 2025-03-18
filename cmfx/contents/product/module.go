// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package product

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/relationship/eav"
)

type Module struct {
	db    *orm.DB
	mod   *cmfx.Module
	attrs *eav.Module
}

func Load(mod *cmfx.Module, tablePrefix string) *Module {
	m := &Module{
		db:    buildDB(mod, tablePrefix),
		mod:   mod,
		attrs: eav.Load(mod, tablePrefix),
	}

	return m
}
