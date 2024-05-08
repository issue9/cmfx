// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package settings

import (
	"github.com/issue9/conv"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func Install(mod *cmfx.Module, tableName string) {
	db := buildDB(mod, tableName)
	if err := db.Create(&modelSetting{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
}

// InstallObject 向数据表中安装一个设置对象
//
// preset 默认值；
func InstallObject[T any](s *Settings, id string, preset *T) error {
	checkObjectType[T]()

	ss, err := toModels(preset, s.presetUID, id)
	if err != nil {
		return err
	}

	items, err := conv.SliceOf[orm.TableNamer](ss)
	if err != nil {
		return err
	}
	return s.db.InsertMany(50, items...)
}
