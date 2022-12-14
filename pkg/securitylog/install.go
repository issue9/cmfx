// SPDX-License-Identifier: MIT

package securitylog

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

func Install(mod string, db *orm.DB) {
	e := orm.Prefix(mod).DB(db)

	cmfx.Init(nil, func() error {
		return web.NewStackError(e.Create(&log{}))
	})
}
