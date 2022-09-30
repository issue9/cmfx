// SPDX-License-Identifier: MIT

// Package setting 设置项管理
package setting

import (
	"fmt"
	"reflect"

	"github.com/issue9/web"
)

const (
	TypeBool   = "bool"
	TypeNumber = "number"
	TypeString = "string"
)

// Setting 设置项
type Setting struct {
	store  Store
	groups map[string]*Group
}

// Store 设置项的存储接口
type Store interface {
	// Update 将当前内容写入到存储对象
	Update(string, any) error

	// Insert 将内容第一次写入至存储对象
	Insert(string, any) error

	// Load 从存储对象加载数据至对象
	Load(string, any) error

	// Exists 是否存在提定 ID 的设置项
	Exists(string) (bool, error)
}

// Group 对配置对象的操作接口
type Group struct {
	s    *Setting
	attr *groupAttribute
	v    reflect.Value
}

func New(s Store) *Setting {
	return &Setting{
		store:  s,
		groups: make(map[string]*Group, 5),
	}
}

// Register 将对象 g 注册为配置项
//
// 要求 g 必须是一个具有可导出字段的结构体指针。
//
// id 为注册对象的 ID，要求在 [Setting] 中具有唯一性；
// title 简要描述；
// desc 明细说明；
// attrs 对 g 中各个字段的说明；
func (s *Setting) Register(g any, id string, title, desc web.LocaleStringer, attrs map[string]*Attribute) (*Group, error) {
	if _, found := s.groups[id]; found {
		panic(fmt.Sprintf("已经存在相同 id 的对象: %s", id))
	}

	v := reflect.ValueOf(g)
	for v.Kind() == reflect.Pointer {
		v = v.Elem()
	}
	t := v.Type()

	attr := &groupAttribute{
		id:     id,
		title:  title,
		desc:   desc,
		fields: parseAttribute(t, attrs),
		t:      t,
	}

	gg := &Group{
		s:    s,
		attr: attr,
		v:    v,
	}

	exists, err := s.store.Exists(id)
	if err != nil {
		return nil, err
	}

	if exists {
		err = s.store.Load(id, g)
	} else {
		err = s.store.Insert(id, g)

	}
	if err != nil {
		return nil, err
	}

	s.groups[id] = gg
	return gg, nil
}
