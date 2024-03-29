// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package oauth

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

func Install(mod cmfx.Module) {
	cmfx.Init(mod.Server(), nil, func() error {
		return web.NewStackError(mod.DBEngine(nil).Create(&modelOAuth{}))
	})
}
