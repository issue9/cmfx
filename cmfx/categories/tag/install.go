// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package tag

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// Install 安装数据库以及相关的初始数据
func Install(mod *cmfx.Module, tableName string, tag ...string) *Module {
	db := buildDB(mod, tableName)

	if err := db.Create(&TagPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	if len(tag) > 0 {
		err := db.DoTransaction(func(tx *orm.Tx) error {
			tags := make([]orm.TableNamer, 0, len(tag))
			for _, t := range tag {
				tags = append(tags, &TagPO{Title: t})
			}
			return tx.InsertMany(50, tags...)
		})
		if err != nil {
			panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
		}
	}

	return Load(mod, tableName)
}
