// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

func Install(mod *cmfx.Module, o *Config, up *upload.Module, adminL *admin.Module) *Module {
	user.Install(mod)

	if err := mod.DB().Create(&infoPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := Load(mod, o, up, adminL)

	_, err := m.NewMember(user.StateNormal, &MemberTO{
		Username: "m1",
		Password: "",
		Birthday: time.Now(),
		Sex:      types.SexFemale,
		Nickname: "nickname",
	}, "", "ua", "")

	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return m
}
