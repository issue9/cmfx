// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/linkage"
	"github.com/issue9/cmfx/cmfx/user"
)

type Module struct {
	mod    *cmfx.Module
	topics *linkage.Module
}

// Load 加载内容管理模块
func Load(mod *cmfx.Module, u *user.Module) *Module {
	topics := linkage.Load(mod, "topics")

	m := &Module{
		mod:    mod,
		topics: topics,
	}

	// TODO

	return m
}
