// SPDX-License-Identifier: MIT

package securitylog

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

func Install(mod string, db *orm.DB) error {
	e := orm.Prefix(mod).DB(db)

	return cmfx.NewChain().Next(func() error {
		return web.StackError(e.Create(&log{}))
	}).Err
}
