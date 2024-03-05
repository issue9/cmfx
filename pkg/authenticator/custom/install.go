// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package custom

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

func Install(mod cmfx.Module) {
	e := mod.DBEngine(nil)

	cmfx.Init(mod.Server(), nil, func() error {
		return web.NewStackError(e.Create(&modelCustom{}))
	})
}
