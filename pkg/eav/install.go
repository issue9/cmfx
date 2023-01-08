// SPDX-License-Identifier: MIT

package eav

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

// InstallSimple 安装简单的 EAV 数据表
//
// tableName 为表名；
func InstallSimple(tableName string, db *orm.DB) {
	e := orm.Prefix(tableName).DB(db)
	cmfx.Init(nil, func() error {
		return web.NewStackError(e.Create(&modelSimpleEAV{}))
	})

}
