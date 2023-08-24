// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx"
	"github.com/issue9/web"
)

func Install(mod cmfx.Module) {
	cmfx.Init(mod.Server(), nil, func() error {
		return web.NewStackError(mod.DBEngine(nil).Create(&healthModel{}))
	})
}
