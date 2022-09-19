// SPDX-License-Identifier: MIT

package eav

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

// InstallSimple 安装简单的 EAV 数据表
//
// prefix 为表名前缀；
func InstallSimple(prefix string, db *orm.DB) {
	e := orm.Prefix(prefix).DB(db)
	cmfx.Init(nil, func() error {
		return web.StackError(e.Create(&modelSimpleEAV{}))
	})
}
