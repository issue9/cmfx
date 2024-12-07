// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"database/sql"
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

func Install(mod *cmfx.Module, o *Config, up *upload.Module, adminL *admin.Module) {
	user.Install(mod)

	if err := mod.DB().Create(&infoPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := Load(mod, o, up, adminL)

	m1, err := m.UserModule().New(user.StateNormal, "m1", "123", "", "ua", "")
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	m.user.Module().DB().Insert(&infoPO{
		ID:       m1,
		Birthday: sql.NullTime{Time: time.Now(), Valid: true},
		Sex:      types.SexFemale,
		Nickname: "nickname",
	})
}
