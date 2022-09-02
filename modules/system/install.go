// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx/pkg/setting"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

type Installer struct {
	mod  *web.Module
	root *rootLinkage
}

func (i *Installer) Linkage() *Linkage { return i.root.top }

func Install(mod *web.Module, db *orm.DB) (*Installer, error) {
	p := dbPrefix(mod)

	e := p.DB(db)
	err := cmfx.NewChain().Next(func() error {
		return setting.Install(mod, db)
	}).Next(func() error {
		return web.StackError(e.Create(&linkage{}))
	}).Err
	if err != nil {
		return nil, err
	}

	root, err := newRootLinkage(db, p)
	if err != nil {
		return nil, web.StackError(err)
	}

	return &Installer{
		mod:  mod,
		root: root,
	}, nil
}
