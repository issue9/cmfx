// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

func Install(mod *cmfx.Module, o *Config, up *upload.Module) *Module {
	user.Install(mod)
	rbac.Install(mod)

	if err := mod.DB().Create(&info{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	l := Load(mod, o, up)

	if _, err := l.newRole("管理员", "拥有超级权限", ""); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	if _, err := l.newRole("财务", "财务", ""); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	if _, err := l.newRole("编辑", "仅有编辑文章的相关权限", ""); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	us := []*infoWithAccountTO{
		{
			infoWithRoleStateVO: infoWithRoleStateVO{
				info: info{
					Name:     "管理员",
					Nickname: "管理员",
					Sex:      types.SexMale,
				},
			},
			Username: "admin",
			Password: "123",
		},
		{
			infoWithRoleStateVO: infoWithRoleStateVO{
				info: info{
					Name:     "测试用户1",
					Nickname: "测试用户1",
					Sex:      types.SexMale,
				},
			},
			Username: "u1",
			Password: "123",
		},
		{
			infoWithRoleStateVO: infoWithRoleStateVO{
				info: info{
					Name:     "测试用户2",
					Nickname: "测试用户2",
					Sex:      types.SexFemale,
				},
			},
			Username: "u2",
			Password: "123",
		},
		{
			infoWithRoleStateVO: infoWithRoleStateVO{
				info: info{
					Name:     "测试用户3",
					Nickname: "测试用户3",
				},
			},
			Username: "u3",
			Password: "123",
		},
	}

	for _, u := range us {
		if err := l.newAdmin(u, "", "ua", ""); err != nil {
			panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
		}
	}

	return l
}
