// SPDX-License-Identifier: MIT

package eav

import (
	"encoding/json"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web/serializer"
)

// Simple 简单的 EAV 操作接口
//
// 以 JSON 或是类似的编码保存数据，不适合查询类操作。
type Simple[T any] struct {
	db       *orm.DB
	dbPrefix orm.Prefix

	marshal   serializer.MarshalFunc
	unmarshal serializer.UnmarshalFunc
}

// NewSimple 加载简要的 EAV 操作接口
//
// prefix 为表名前缀。
// marshal 和 unmarshal 表示将对象保存至表的编解码方法，如果未指定，则采用 json 的格式；
// T 表示存取对象的类型；
func NewSimple[T any](prefix string, db *orm.DB, marshal serializer.MarshalFunc, unmarshal serializer.UnmarshalFunc) *Simple[T] {
	if marshal == nil {
		marshal = json.Marshal
	}
	if unmarshal == nil {
		unmarshal = json.Unmarshal
	}

	return &Simple[T]{
		db:       db,
		dbPrefix: orm.Prefix(prefix),

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

	e := eav.dbPrefix.DB(eav.db)
	_, err = e.Insert(&modelSimpleEAV{ID: id, Value: data})
	return err
}

func (eav *Simple[T]) Delete(id int64) error {
	e := eav.dbPrefix.DB(eav.db)
	_, err := e.Delete(&modelSimpleEAV{ID: id})
	return err
}

func (eav *Simple[T]) Update(id int64, v *T) error {
	data, err := eav.marshal(v)
	if err != nil {
		return err
	}

	e := eav.dbPrefix.DB(eav.db)
	_, err = e.Update(&modelSimpleEAV{ID: id, Value: data}, "value")
	return err
}

func (eav *Simple[T]) Select(id int64, v *T) (bool, error) {
	e := eav.dbPrefix.DB(eav.db)

	mod := &modelSimpleEAV{ID: id}
	found, err := e.Select(mod)
	if err != nil {
		return false, err
	}
	if !found {
		return false, nil
	}
	return true, eav.unmarshal(mod.Value, v)
}
