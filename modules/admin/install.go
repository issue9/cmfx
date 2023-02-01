// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/authenticator/password"
	"github.com/issue9/cmfx/pkg/rbac"
	"github.com/issue9/cmfx/pkg/securitylog"
	"github.com/issue9/cmfx/pkg/token"
)

func Install(s *web.Server, mod string, db *orm.DB) {
	e := orm.Prefix(mod).DB(db)

	token.Install(s, mod, db)
	securitylog.Install(s, mod, db)
	password.Install(s, mod+"_"+authPasswordType, db)
	rbac.Install(s, mod, db)

	cmfx.Init(s, nil, func() error {
		return web.NewStackError(e.Create(&ModelAdmin{}))
	}, func() error {
		a, err := rbac.New(s, mod, db)
		if err != nil {
			return web.NewStackError(err)
		}

		cmfx.Init(s, nil, func() error {
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
		us := []orm.TableNamer{
			&ModelAdmin{
				ID:       1,
				Name:     "管理员",
				Nickname: "管理员",
				Super:    true,
				Sex:      SexMale,
				Username: "admin",
			},
			&ModelAdmin{
				ID:       2,
				Name:     "测试用户1",
				Nickname: "测试用户1",
				Sex:      SexMale,
				Username: "u2",
			},
			&ModelAdmin{
				ID:       3,
				State:    StateLocked,
				Name:     "测试用户2",
				Nickname: "测试用户2",
				Sex:      SexFemale,
				Username: "u3",
			},
			&ModelAdmin{
				ID:       4,
				State:    StateLeft,
				Name:     "测试用户3",
				Nickname: "测试用户3",
				Sex:      SexUnknown,
				Username: "u4",
			},
		}

		return web.NewStackError(e.InsertMany(10, us...))
	}, func() error {
		a, err := rbac.New(s, mod, db)
		if err != nil {
			return web.NewStackError(err)
		}
		tx, err := db.Begin()
		if err != nil {
			return web.NewStackError(err)
		}

		cmfx.Init(s, func() {
			tx.Rollback()
		}, func() error {
			return web.NewStackError(a.Link(tx, 1, 1))
		}, func() error {
			return web.NewStackError(a.Link(tx, 2, 2))
		}, func() error {
			return web.NewStackError(a.Link(tx, 3, 2, 3))
		}, func() error {
			return web.NewStackError(a.Link(tx, 4, 2, 3))
		})

		return web.NewStackError(tx.Commit())
	}, func() (err error) {
		p := password.New(s, orm.Prefix(mod+"_"+authPasswordType), db)

		tx, err := db.Begin()
		if err != nil {
			return web.NewStackError(err)
		}

		cmfx.Init(s, func() {
			tx.Rollback()
		}, func() error {
			return web.NewStackError(p.Add(tx, 1, "admin", defaultPassword))
		}, func() error {
			return web.NewStackError(p.Add(tx, 2, "u1", defaultPassword))
		}, func() error {
			return web.NewStackError(p.Add(tx, 3, "u2", defaultPassword))
		}, func() error {
			return web.NewStackError(p.Add(tx, 4, "u3", defaultPassword))
		})

		return web.NewStackError(tx.Commit())
	})
}
