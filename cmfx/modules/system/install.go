// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/user/settings"
)

func Install(mod *cmfx.Module, conf *Config, adminL *admin.Module) *Module {
	if err := mod.DB().Create(&healthPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	s := settings.Install(mod, settingsTableName)
	if err := settings.InstallObject(s, generalSettingName, &generalSettings{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	if err := settings.InstallObject(s, auditSettingName, &filters.Config{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return Load(mod, conf, adminL)
}
