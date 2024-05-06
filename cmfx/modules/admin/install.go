// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport/password"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

func Install(mod *cmfx.Module) {
	user.Install(mod)
	password.Install(mod)
	rbac.Install(mod)

	if err := mod.DB().Create(&modelInfo{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	r := rbac.New(mod, nil)
	a, err := r.NewRoleGroup(mod.ID(), 0)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	if _, err = a.NewRole("管理员", "拥有超级权限", ""); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	if _, err = a.NewRole("财务", "财务", ""); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	if _, err = a.NewRole("编辑", "仅有编辑文章的相关权限", ""); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	us := []*respInfoWithAccount{
		{
			respInfoWithRoleState: respInfoWithRoleState{
				respInfo: respInfo{
					Name:     "管理员",
					Nickname: "管理员",
					Sex:      types.SexMale,
				},
			},
			Username: "admin",
			Password: defaultPassword,
		},
		{
			respInfoWithRoleState: respInfoWithRoleState{
				respInfo: respInfo{
					Name:     "测试用户1",
					Nickname: "测试用户1",
					Sex:      types.SexMale,
				},
			},
			Username: "u1",
			Password: defaultPassword,
		},
		{
			respInfoWithRoleState: respInfoWithRoleState{
				respInfo: respInfo{
					Name:     "测试用户2",
					Nickname: "测试用户2",
					Sex:      types.SexFemale,
				},
			},
			Username: "u2",
			Password: defaultPassword,
		},
		{
			respInfoWithRoleState: respInfoWithRoleState{
				respInfo: respInfo{
					Name:     "测试用户3",
					Nickname: "测试用户3",
				},
			},
			Username: "u3",
			Password: defaultPassword,
		},
	}

	p := password.New(mod, 11)

	for _, u := range us {
		if err := newAdmin(mod, p, u, time.Now()); err != nil {
			panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
		}
	}
}
