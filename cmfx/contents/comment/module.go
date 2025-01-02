// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import "github.com/issue9/cmfx/cmfx"

type Module struct {
	mod *cmfx.Module
}

func Load(mod *cmfx.Module) *Module {
	m := &Module{
		mod: mod,
	}

	// TODO

	return m
}
