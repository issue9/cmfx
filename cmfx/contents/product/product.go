// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package product 商品类的内容
package product

import (
	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/relationship/eav"
)

// Products 提供了商品管理等功能
type Products struct {
	db    *orm.DB
	mod   *cmfx.Module
	attrs *eav.EAVs
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}

func NewProducts(mod *cmfx.Module, tablePrefix string) *Products {
	m := &Products{
		db:    buildDB(mod, tablePrefix),
		mod:   mod,
		attrs: eav.NewEAVs(mod, tablePrefix),
	}

	return m
}
