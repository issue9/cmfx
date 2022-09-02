// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/passport"
	"github.com/issue9/cmfx/pkg/rbac"
	"github.com/issue9/cmfx/pkg/securitylog"
	"github.com/issue9/cmfx/pkg/setting"
	"github.com/issue9/cmfx/pkg/token"
)

func Install(mod *web.Module, db *orm.DB) {
	prefix := dbPrefix(mod)
	e := prefix.DB(db)

	cmfx.NewChain().Next(func() error {
		return passport.Install(mod, db)
	}).Next(func() error {
		return rbac.Install(mod, db)
	}).Next(func() error {
		return web.StackError(e.Create(&modelAdmin{}))
	}).Next(func() error {
		return setting.Install(mod, db)
	}).Next(func() error {
		return token.Install(mod, db)
	}).Next(func() error {
		return securitylog.Install(mod, db)
	}).Next(func() error {
		a, err := rbac.New(mod, db, nil)
		if err != nil {
			return web.StackError(err)
		}

		err = cmfx.NewChain().Next(func() error {
			_, err := a.NewRole(0, "管理员", "拥有超级权限")
			return err
		}).Next(func() error {
			_, err := a.NewRole(0, "财务", "财务")
			return err
		}).Next(func() error {
			_, err := a.NewRole(0, "编辑", "仅有编辑文章的相关权限")
			return err
		}).Err
		return web.StackError(err)
	}).Next(func() error {
		us := []orm.TableNamer{
			&modelAdmin{
				ID:       1,
				Name:     "管理员",
				Nickname: "管理员",
				Super:    true,
				Sex:      SexMale,
				Username: "admin",
			},
			&modelAdmin{
				ID:       2,
				Name:     "测试用户1",
				Nickname: "测试用户1",
				Sex:      SexMale,
				Username: "u2",
			},
			&modelAdmin{
				ID:       3,
				State:    StateLocked,
				Name:     "测试用户2",
				Nickname: "测试用户2",
				Sex:      SexFemale,
				Username: "u3",
			},
			&modelAdmin{
				ID:       4,
				State:    StateLeft,
				Name:     "测试用户3",
				Nickname: "测试用户3",
				Sex:      SexUnknown,
				Username: "u4",
			},
		}

		return web.StackError(e.InsertMany(10, us...))
	}).Next(func() error {
		a, err := rbac.New(mod, db, nil)
		if err != nil {
			return web.StackError(err)
		}
		tx, err := db.Begin()
		if err != nil {
			return web.StackError(err)
		}

		err = cmfx.NewChain().Next(func() error {
			return web.StackError(a.Link(tx, 1, 1))
		}).Next(func() error {
			return web.StackError(a.Link(tx, 2, 2))
		}).Next(func() error {
			return web.StackError(a.Link(tx, 3, 2, 3))
		}).Next(func() error {
			return web.StackError(a.Link(tx, 4, 2, 3))
		}).Err
		if err != nil {
			tx.Rollback()
			return web.StackError(err)
		}

		return web.StackError(tx.Commit())
	}).Next(func() (err error) {
		a := passport.New(mod, db)
		p := a.Password(mod.BuildID(authPasswordType))

		tx, err := db.Begin()
		if err != nil {
			return web.StackError(err)
		}

		err = cmfx.NewChain().Next(func() error {
			return web.StackError(p.Add(tx, 1, "admin", defaultPassword))
		}).Next(func() error {
			return web.StackError(p.Add(tx, 2, "u1", defaultPassword))
		}).Next(func() error {
			return web.StackError(p.Add(tx, 3, "u2", defaultPassword))
		}).Next(func() error {
			return web.StackError(p.Add(tx, 4, "u3", defaultPassword))
		}).Err

		if err != nil {
			tx.Rollback()
			return err
		}

		return web.StackError(tx.Commit())
	}).Fatal(mod.Server().Logs().FATAL(), 2)
}
