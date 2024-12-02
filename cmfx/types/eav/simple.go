// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"encoding/json"

	"github.com/issue9/orm/v6"

	"github.com/issue9/cmfx/cmfx"
)

type MarshalFunc func(any) ([]byte, error)

type UnmarshalFunc func([]byte, any) error

// Simple 简单的 EAV 操作接口
//
// 以 JSON 或是类似的编码保存数据，不适合查询类操作。
type Simple[T any] struct {
	db        *orm.DB
	marshal   MarshalFunc
	unmarshal UnmarshalFunc
}

// NewSimple 声明 [Simple] 对象
//
// mod 表示所属的模块；
// tableName 为表名；
// marshal 和 unmarshal 表示将对象保存至表的编解码方法，如果未指定，则采用 JSON 的格式；
// T 表示存取对象的类型；
func NewSimple[T any](mod *cmfx.Module, tableName string, marshal MarshalFunc, unmarshal UnmarshalFunc) *Simple[T] {
	if marshal == nil {
		marshal = json.Marshal
	}
	if unmarshal == nil {
		unmarshal = json.Unmarshal
	}

	return &Simple[T]{
		db:        mod.DB().New(mod.DB().TablePrefix() + tableName),
		marshal:   marshal,
		unmarshal: unmarshal,
	}
}

// Insert 插入一条数据
//
// id 为关联数据的 id；
// val 为插入的数据，其中键名为列名，键值为关联的值；
func (eav *Simple[T]) Insert(id int64, v *T) error {
	data, err := eav.marshal(v)
	if err != nil {
		return err
	}

	_, err = eav.db.Insert(&simpleEavPO{ID: id, Value: data})
	return err
}

func (eav *Simple[T]) Delete(id int64) error {
	_, err := eav.db.Delete(&simpleEavPO{ID: id})
	return err
}

func (eav *Simple[T]) Update(id int64, v *T) error {
	data, err := eav.marshal(v)
	if err != nil {
		return err
	}

	_, err = eav.db.Update(&simpleEavPO{ID: id, Value: data}, "value")
	return err
}

func (eav *Simple[T]) Select(id int64, v *T) (bool, error) {
	mod := &simpleEavPO{ID: id}
	found, err := eav.db.Select(mod)
	if err != nil {
		return false, err
	}
	if !found {
		return false, nil
	}
	return true, eav.unmarshal(mod.Value, v)
}
