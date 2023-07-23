// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
)

func Install(s *web.Server, mod string, db *orm.DB) {
	e := orm.Prefix(mod).DB(db)

	cmfx.Init(s, nil, func() error {
		return web.NewStackError(e.Create(&healthModel{}))
	})
}
