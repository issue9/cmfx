// SPDX-License-Identifier: MIT

package setting

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

func Install(mod string, db *orm.DB) {
	e := orm.Prefix(mod).DB(db)

	cmfx.NewChain().Next(func() error {
		return web.StackError(e.Create(&modelSetting{}))
	}).Panic()
}
