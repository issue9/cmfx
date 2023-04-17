// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/system/linkage"
)

func Install(s *web.Server, mod string, db *orm.DB) {
	p := orm.Prefix(mod)
	e := p.DB(db)

	cmfx.Init(s, nil, func() error {
		return web.NewStackError(linkage.Install(s, mod, db))
	}, func() error {
		return web.NewStackError(e.Create(&healthModel{}))
	})
}
