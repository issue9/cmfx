// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package eav Entity-Attribute-Values 数据表管理
package eav

import (
	"database/sql"
	"reflect"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/fetch"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

type ValueType interface {
	~int64 | ~string | time.Time | *time.Time | ~float64
}

// EAVs 提供 Entity-Attribute-Values 数据表管理
type EAVs struct {
	db  *orm.DB
	mod *cmfx.Module
}

func NewEAVs(mod *cmfx.Module, prefix string) *EAVs {
	return &EAVs{
		db:  buildDB(mod, prefix),
		mod: mod,
	}
}

func Install(mod *cmfx.Module, prefix string) *EAVs {
	db := buildDB(mod, prefix)
	if err := db.Create(&attrPO{}, &valueIntPO{}, &valueStringPO{}, &valueDatetimePO{}, &valueFloatPO{}); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return NewEAVs(mod, prefix)
}

func (m *EAVs) AddAttribute(name string) (int64, error) {
	return m.db.LastInsertID(&attrPO{Name: name})
}

func (m *EAVs) SetAttribute(id int64, name string) error {
	_, err := m.db.SQLBuilder().Update().
		Where("id=?", id).
		AndIsNull("deleted"). // 已删除的无法修改
		Table(orm.TableName(&attrPO{})).
		Set("name", name).
		Exec()
	return err
}

func (m *EAVs) DelAttribute(id int64) error {
	_, err := m.db.SQLBuilder().Update().
		Where("id=?", id).
		AndIsNull("deleted"). // 已删除的无法修改
		Table(orm.TableName(&attrPO{})).
		Set("deleted", sql.NullTime{Valid: true, Time: time.Now()}).
		Exec()
	return err
}

// GetAttribute 获取属性 id 对应的名称
//
// NOTE: 该操作不会考虑 id 是否已经被删除，如果不存在返回空字符串。
func (m *EAVs) GetAttribute(id int64) (string, error) {
	rows, err := m.db.SQLBuilder().Select().Where("id=?", id).From(orm.TableName(&attrPO{})).Query()
	if err != nil {
		return "", err
	}
	defer rows.Close()

	ss, err := fetch.Column[string](true, "name", rows)
	if err != nil {
		return "", err
	}

	if len(ss) == 0 {
		return "", nil
	}
	return ss[0], nil
}

type AttributeVO struct {
	XMLName struct{} `json:"-" yaml:"-" cbor:"-" xml:"attribute"`
	ID      int64    `json:"id" yaml:"id" xml:"id" cbor:"id" orm:"name(id)"`
	Name    string   `json:"name" yaml:"name" xml:"name" cbor:"name" orm:"name(name)"`
}

func (m *EAVs) GetAttributes() ([]*AttributeVO, error) {
	attrs := make([]*AttributeVO, 0, 10)
	_, err := m.db.SQLBuilder().Select().
		AndIsNull("deleted").
		From(orm.TableName(&attrPO{})).
		QueryObject(true, &attrs)
	if err != nil {
		return nil, err
	}
	return attrs, nil
}

func AddValue[T ValueType](m *EAVs, entity, attr int64, val T) (int64, error) {
	return m.db.SQLBuilder().Insert().
		Columns("entity", "attr", "value").
		Values(entity, attr, val).
		Table(getTableName[T]()).
		LastInsertID("id")
}

func SetValue[T ValueType](m *EAVs, id int64, val T) error {
	_, err := m.db.SQLBuilder().Update().
		Where("id=?", id).
		Table(getTableName[T]()).
		Set("value", val).
		AndIsNull("deleted"). // 已删除的无法修改
		Exec()
	return err
}

func DelValue[T ValueType](m *EAVs, id int64) error {
	_, err := m.db.SQLBuilder().Update().
		Where("id=?", id).
		Table(getTableName[T]()).
		Set("deleted", sql.NullTime{Valid: true, Time: time.Now()}).
		AndIsNull("deleted"). // 已删除的无法修改
		Exec()
	return err
}

type ValueVO[T ValueType] struct {
	XMLName struct{} `json:"-" yaml:"-" cbor:"-" xml:"value"`
	ID      int64    `json:"id" yaml:"id" xml:"id" cbor:"id" orm:"name(id)"`
	Value   T        `json:"value" yaml:"value" xml:"value" cbor:"value" orm:"name(value)"`
}

// GetValue 获得 id 对应的值
//
// NOTE: 该操作不会考虑 id 是否已经被删除。
func GetValue[T ValueType](m *EAVs, id int64) (T, error) {
	rows, err := m.db.SQLBuilder().Select().Where("id=?", id).From(getTableName[T]()).Query()

	var v T
	if err != nil {
		return v, err
	}
	defer rows.Close()

	vv, err := fetch.Column[T](true, "value", rows)
	if len(vv) == 0 {
		return v, nil
	}
	return vv[0], err
}

func GetValues[T ValueType](m *EAVs, entity, attr int64) ([]*ValueVO[T], error) {
	vals := make([]*ValueVO[T], 0, 10)
	_, err := m.db.SQLBuilder().Select().
		Where("entity=?", entity).
		And("attr=?", attr).
		AndIsNull("deleted").
		From(getTableName[T]()).
		QueryObject(true, &vals)
	if err != nil {
		return nil, err
	}
	return vals, nil
}

var tableNames = map[reflect.Kind]string{
	reflect.Int64:   orm.TableName(&valueIntPO{}),
	reflect.String:  orm.TableName(&valueStringPO{}),
	reflect.Float64: orm.TableName(&valueFloatPO{}),
	reflect.Struct:  orm.TableName(&valueDatetimePO{}),
}

func getTableName[T ValueType]() string {
	return tableNames[reflect.TypeFor[T]().Kind()]
}

func buildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_" + tableName)
}
