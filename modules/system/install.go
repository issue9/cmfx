// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

type Installer struct {
	mod  string
	root *rootLinkage
}

func (i *Installer) Linkage() *Linkage { return i.root.top }

func Install(mod string, db *orm.DB) *Installer {
	p := orm.Prefix(mod)
	e := p.DB(db)
	cmfx.Init(nil, func() error {
		return web.StackError(e.Create(&linkage{}))
	})

	root, err := newRootLinkage(db, p)
	if err != nil {
		panic(err)
	}

	return &Installer{
		mod:  mod,
		root: root,
	}
}
