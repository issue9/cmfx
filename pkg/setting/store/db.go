// SPDX-License-Identifier: MIT

package store

import (
	"fmt"

	"github.com/issue9/orm/v5"

	"github.com/issue9/cmfx/pkg/setting"
)

type DB struct {
	dbPrefix orm.Prefix
	db       *orm.DB
}

func NewDB(mod string, db *orm.DB) setting.Store {
	return &DB{
		dbPrefix: orm.Prefix(mod),
		db:       db,
	}
}

func (g *DB) Load(id string, v any) error {
	p := g.dbPrefix.DB(g.db)

	mod := &modelSetting{ID: id}
	found, err := p.Select(mod)
	if err != nil {
		return err
	}
	if !found {
		panic(fmt.Sprintf("不存在的数据 %s", id))
	}

	return unmarshal(mod.Value, v)
}

func (g *DB) Update(id string, v any) error {
	s, err := marshal(v)
	if err != nil {
		return err
	}

	p := g.dbPrefix.DB(g.db)
	_, err = p.Update(&modelSetting{ID: id, Value: s})
	return err
}

func (g *DB) Insert(id string, v any) error {
	s, err := marshal(v)
	if err != nil {
		return err
	}

	p := g.dbPrefix.DB(g.db)
	_, err = p.Insert(&modelSetting{ID: id, Value: s})
	return err
}

func (g *DB) Exists(id string) (bool, error) {
	p := g.dbPrefix.DB(g.db)
	cnt, err := p.Where("id=?", id).Count(&modelSetting{})
	return cnt > 0, err
}
