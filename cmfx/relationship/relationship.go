// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package relationship 用于处理多对多的数据表关系
package relationship

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/fetch"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// T 限制了可用的字段类型
type T interface {
	~string | ~int | ~int64
}

// Relationships 提供了多对多的数据表关系
type Relationships[T1, T2 T] struct {
	db  *orm.DB
	mod *cmfx.Module
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}

func NewRelationships[T1, T2 T](mod *cmfx.Module, tableName string) *Relationships[T1, T2] {
	return &Relationships[T1, T2]{
		db:  buildDB(mod, tableName),
		mod: mod,
	}
}

func Install[T1, T2 T](mod *cmfx.Module, tableName string) *Relationships[T1, T2] {
	db := buildDB(mod, tableName)
	if err := db.Create(&relationshipPO[T1, T2]{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return NewRelationships[T1, T2](mod, tableName)
}

func (m *Relationships[T1, T2]) engine(tx *orm.Tx) orm.Engine {
	if tx == nil {
		return m.db
	}
	return tx.NewEngine(m.db.TablePrefix())
}

func (m *Relationships[T1, T2]) Add(tx *orm.Tx, v1 T1, v2 T2) error {
	_, err := m.engine(tx).Insert(&relationshipPO[T1, T2]{V1: v1, V2: v2})
	return err
}

func (m *Relationships[T1, T2]) Delete(tx *orm.Tx, v1 T1, v2 T2) error {
	_, err := m.engine(tx).Delete(&relationshipPO[T1, T2]{V1: v1, V2: v2})
	return err
}

func (m *Relationships[T1, T2]) DeleteByV1(tx *orm.Tx, v1 T1) error {
	_, err := m.engine(tx).Where("v1=?", v1).Delete(&relationshipPO[T1, T2]{})
	return err
}

func (m *Relationships[T1, T2]) DeleteByV2(tx *orm.Tx, v2 T2) error {
	_, err := m.engine(tx).Where("v2=?", v2).Delete(&relationshipPO[T1, T2]{})
	return err
}

func (m *Relationships[T1, T2]) CountByV1(v1 T1) (int64, error) {
	return m.db.Where("v1=?", v1).Count(&relationshipPO[T1, T2]{})
}

func (m *Relationships[T1, T2]) CountByV2(v2 T2) (int64, error) {
	return m.db.Where("v2=?", v2).Count(&relationshipPO[T1, T2]{})
}

// ListV1 列出所有与 v2 关联的 v1 列表
func (m *Relationships[T1, T2]) ListV1(v2 T2) ([]T1, error) {
	rows, err := m.db.SQLBuilder().Select().From(orm.TableName(&relationshipPO[T1, T2]{})).Where("v2=?", v2).Query()
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return fetch.Column[T1](false, "v1", rows)
}

// ListV2 列出所有与 v1 关联的 v2 列表
func (m *Relationships[T1, T2]) ListV2(v1 T1) ([]T2, error) {
	rows, err := m.db.SQLBuilder().Select().From(orm.TableName(&relationshipPO[T1, T2]{})).Where("v1=?", v1).Query()
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return fetch.Column[T2](false, "v2", rows)
}

// LeftJoin LEFT JOIN 至 sql
//
// alias 为当前的 relationshipPO 表指定别名，该别名可能在 on 参数中可能会用到；
func (m *Relationships[T1, T2]) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string) {
	tb := m.db.TablePrefix() + (&relationshipPO[T1, T2]{}).TableName()
	sql.Join("LEFT", tb, alias, on)
}
