// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

// Install 安装数据
//
// ts 可用的类型名称；
// levels 可用的级别名称；
func Install(mod *cmfx.Module, o *Config, up *upload.Module, adminL *admin.Module, ts []string, levels []string) *Module {
	user.Install(mod)
	tag.Install(mod, typesTableName, ts...)
	tag.Install(mod, levelsTableName, levels...)

	if err := mod.DB().Create(&infoPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := Load(mod, o, up, adminL)

	_, err := m.Add(user.StateNormal, &RegisterInfo{
		Username: "m1",
		Password: "123",
		Birthday: time.Now(),
		Sex:      types.SexFemale,
		Nickname: "nickname",
	}, "", "ua", "")

	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return m
}
