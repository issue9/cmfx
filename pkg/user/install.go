// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/user/token"
)

func Install(mod cmfx.Module) {
	token.Install(mod)

	cmfx.Init(mod.Server(), nil, func() error {
		return web.NewStackError(mod.DBEngine(nil).Create(&User{}))
	}, func() error {
		return web.NewStackError(mod.DBEngine(nil).Create(&log{}))
	})
}
