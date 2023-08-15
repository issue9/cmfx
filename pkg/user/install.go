// SPDX-License-Identifier: MIT

package user

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/token"
)

func Install(s *web.Server, mod string, db *orm.DB) {
	e := orm.Prefix(mod).DB(db)

	token.Install(s, mod, db)

	cmfx.Init(s, nil, func() error {
		return web.NewStackError(e.Create(&User{}))
	}, func() error {
		return web.NewStackError(e.Create(&log{}))
	})
}
