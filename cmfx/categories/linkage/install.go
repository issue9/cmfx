// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// Install 安装数据库以及相关的初始数据
func Install(mod *cmfx.Module, tableName string, linkage *Linkage) *Module {
	db := buildDB(mod, tableName)

	if err := db.Create(&linkagePO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	if linkage == nil {
		panic("参数 linkage 不能为空")
	}

	err := db.DoTransaction(func(tx *orm.Tx) error {
		return install(tx, linkage, 0)
	})
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return Load(mod, tableName)
}

func install(tx *orm.Tx, linkage *Linkage, parent int64) error {
	lastID, err := tx.LastInsertID(linkage.toPO(parent))
	if err != nil {
		return err
	}

	for _, item := range linkage.Items {
		err = install(tx, item, lastID)
		if err != nil {
			return err
		}
	}

	return nil
}
