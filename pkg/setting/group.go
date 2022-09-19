// SPDX-License-Identifier: MIT

package setting

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/issue9/conv"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
)

// Group 对配置对象的操作接口
type Group struct {
	s      *Setting
	attr   *groupAttribute
	v      reflect.Value
	notify func()
}

// Register 注册配置对象
//
// id 表示该设置对象的唯一 ID；
// title,desc 对该组设置项的描述；
// g 设置项的对象，要求该对象的所有字段都是基本类型；
// attrs 对 g 各个字段的描述，键名为字段名；
func (s *Setting) NewGroup(id string, g any, title, desc web.LocaleStringer, attrs map[string]*Attribute, notify func()) (*Group, error) {
	// TODO 若支持泛型方法，v 可以指定具体类型？

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
		s:      s,
		attr:   attr,
		v:      v,
		notify: notify,
	}

	if err := gg.insert(); err != nil {
		return nil, err
	}

	s.groups[id] = gg
	return gg, nil
}

// Load 加载数据库的数据至关联的对象
func (g *Group) Load() error {
	p := g.s.dbPrefix.DB(g.s.db)

	list := make([]*modelSetting, 0, len(g.attr.fields))
	cnt, err := p.Where("{group}=?", g.attr.id).Select(true, &list)
	if err != nil {
		return err
	}
	if cnt != len(g.attr.fields) {
		return fmt.Errorf("%s 数据库的字段数量 %d 与关联的字段数量 %d 不相同", g.attr.id, cnt, len(g.attr.fields))
	}

	for _, item := range list {
		attr := g.attr.fields[item.Key]
		v := g.v.Field(attr.index)

		if attr.slice {
			data, err := conv.Bytes(item.Value)
			if err != nil {
				return err
			}
			if err := json.Unmarshal(data, v.Addr().Interface()); err != nil {
				return err
			}
		} else {
			if err := conv.Value(item.Value, v); err != nil {
				return err
			}
		}

	}

	if g.notify != nil {
		g.notify()
	}
	return nil
}

func (g *Group) Update() error { return g.save(false) }

func (g *Group) insert() error { return g.save(true) }

func (g *Group) save(insert bool) error {
	tx, err := g.s.db.Begin()
	if err != nil {
		return err
	}

	p := g.s.dbPrefix.Tx(tx)
	action := func(v orm.TableNamer) (sql.Result, error) { return p.Update(v) }
	if insert {
		action = p.Insert
	}

	for _, attr := range g.attr.fields {
		field := g.v.Field(attr.index).Interface()

		if g.attr.fields[attr.id].slice { // 数组不支持直接写入数据库
			data, err := json.Marshal(field)
			if err != nil {
				return err
			}
			field = data
		}

		obj := &modelSetting{
			Group: g.attr.id,
			Key:   attr.id,
			Value: field,
		}
		if _, err = action(obj); err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}
