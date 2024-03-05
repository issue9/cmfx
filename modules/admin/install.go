// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/authenticator/password"
	"github.com/issue9/cmfx/pkg/rbac"
	"github.com/issue9/cmfx/pkg/user"
)

func Install(mod cmfx.Module) {
	e := mod.DBEngine(nil)

	user.Install(mod)
	password.Install(mod.New("_"+authPasswordType, web.Phrase("admin installer")))
	rbac.Install(mod)

	cmfx.Init(mod.Server(), nil, func() error {
		return web.NewStackError(e.Create(&modelInfo{}))
	}, func() error {
		a, err := rbac.New(mod)
		if err != nil {
			return web.NewStackError(err)
		}

		cmfx.Init(mod.Server(), nil, func() error {
			_, err := a.NewRole(0, "管理员", "拥有超级权限")
			return web.NewStackError(err)
		}, func() error {
			_, err := a.NewRole(0, "财务", "财务")
			return web.NewStackError(err)
		}, func() error {
			_, err := a.NewRole(0, "编辑", "仅有编辑文章的相关权限")
			return web.NewStackError(err)
		})

		return nil
	}, func() error {
		us := []*respInfoWithAccount{
			{
				respInfoWithRoleState: respInfoWithRoleState{
					respInfo: respInfo{
						Name:     "管理员",
						Nickname: "管理员",
						Sex:      cmfx.SexMale,
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
						Sex:      cmfx.SexMale,
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
						Sex:      cmfx.SexFemale,
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

		a, err := rbac.New(mod)
		if err != nil {
			return web.NewStackError(err)
		}

		p := password.New(mod.New("_"+authPasswordType, web.Phrase("admin installer")))

		for _, u := range us {
			if err := newAdmin(mod, a, p, u); err != nil {
				return web.NewStackError(err)
			}
		}

		return nil
	})
}
