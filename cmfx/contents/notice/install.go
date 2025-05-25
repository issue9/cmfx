// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/user"
)

func Install(u *user.Users) *Notices {
	mod := u.Module()

	tag.Install(mod, typesKey, "平台公告", "活动通知")

	if err := mod.DB().Create(&noticePO{}, &groupPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return NewNotices(u)
}
