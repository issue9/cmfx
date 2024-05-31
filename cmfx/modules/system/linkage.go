// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"reflect"
	"slices"
	"time"

	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
)

// Linkage 级联菜单元素
type Linkage[T any] struct {
	l     *Module
	id    int64
	title string
	items []*LinkageItem[T]
	key   string
}

type LinkageItem[T any] struct {
	ID    int64
	Data  T
	Items []*LinkageItem[T]
}

// LoadLinkage 加载一组级联数据
func LoadLinkage[T any](l *Module, key string) (*Linkage[T], error) {
	checkObjectType[T]()

	db := l.mod.DB()

	modItems := make([]*modelLinkage, 0, 10)
	size, err := db.Where("key=?", key).AndIsNull("deleted").Select(true, &modItems)
	if err != nil {
		return nil, err
	}
	if size == 0 {
		return nil, web.NewLocaleError("linkage %s not found", key)
	}

	var root *Linkage[T]
	linkageItems := make([]*LinkageItem[T], 0, 10)
	for _, mod := range modItems {
		if mod.Parent == 0 {
			root = &Linkage[T]{
				l:     l,
				id:    mod.ID,
				key:   mod.Key,
				title: mod.Title,
			}
			continue
		}

		var data T
		if mod.Data != nil {
			if err := json.Unmarshal(mod.Data, &data); err != nil {
				return nil, err
			}
		}

		item := &LinkageItem[T]{
			ID:   mod.ID,
			Data: data,
		}

		linkageItems = append(linkageItems, item)
	}

	if root == nil {
		return nil, web.NewLocaleError("linkage key %s not found", key)
	}

	root.items = make([]*LinkageItem[T], 0, len(linkageItems))

	// 整理上下级关系
	for _, item := range linkageItems {
		if item.ID == 0 {
			panic("未从数据库读取到 id") // 这应该是代码出错或是数据库被修改
		}

		modItem, found := sliceutil.At(modItems, func(i *modelLinkage, _ int) bool { return i.ID == item.ID })
		if !found {
			panic("无法从原数据中找到相应的 ID") // 这应该是代码出错或是数据库被修改
		}
		if modItem.Parent == 0 {
			panic("parent.ID 为零的应该在之前代码中被过滤") // 这应该是代码出错或是数据库被修改
		}

		if modItem.Parent == root.id {
			root.items = append(root.items, item)
		} else {
			parent, found := sliceutil.At(linkageItems, func(i *LinkageItem[T], _ int) bool { return i.ID == modItem.Parent })
			if !found {
				return nil, web.NewLocaleError("linkage item %d parent %d not found", item.ID, modItem.Parent)
			}
			parent.Items = append(parent.Items, item)
		}
	}

	return root, nil
}

// Add 将 v 添加至 parent 之下
func (l *Linkage[T]) Add(v T, parent int64) (*LinkageItem[T], error) {
	data, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	last, err := l.l.mod.DB().LastInsertID(&modelLinkage{
		Key:     l.Key(),
		Deleted: sql.NullTime{},
		Data:    data,
		Parent:  parent,
	})
	item := &LinkageItem[T]{Data: v, ID: last}

	if parent == 0 {
		l.items = append(l.items, item)
	} else {
		_, c := l.findByID(parent)
		if c == nil {
			return nil, errLinkageItemNotFound(parent)
		}
		c.Items = append(c.Items, item)
	}

	return item, nil
}

func (l *Linkage[T]) Delete(id int64) error {
	p, c := l.findByID(id)
	if c == nil {
		return errLinkageItemNotFound(id)
	}

	mod := &modelLinkage{Deleted: sql.NullTime{Time: time.Now(), Valid: true}}
	if p == nil {
		if _, err := l.l.mod.DB().Where("id=?", id).Update(mod); err != nil {
			return err
		}
		l.items = slices.DeleteFunc(l.items, func(i *LinkageItem[T]) bool { return i.ID == id })
	} else {
		if _, err := l.l.mod.DB().Where("id=?", id).And("parent=?", p.ID).Update(mod); err != nil {
			return err
		}
		p.Items = slices.DeleteFunc(p.Items, func(i *LinkageItem[T]) bool { return i.ID == id })
	}

	return nil
}

func (l *Linkage[T]) Set(id int64, v T) error {
	_, c := l.findByID(id)
	if c == nil {
		return errLinkageItemNotFound(id)
	}

	data, err := json.Marshal(v)
	if err != nil {
		return err
	}
	mod := &modelLinkage{ID: id, Data: data}
	if _, err := l.l.mod.DB().Update(mod, "data"); err != nil {
		return err
	}

	c.Data = v

	return nil
}

// Get 返回指定 id 的子元素
//
// 可以查找非根元素的元素，如果找不到则返回 nil。
func (l *Linkage[T]) Get(id int64) *LinkageItem[T] {
	_, curr := l.findByID(id)
	return curr
}

func (l *Linkage[T]) Items() []*LinkageItem[T] { return l.items }

func (l *Linkage[T]) Title() string { return l.title }

func (l *Linkage[T]) Key() string { return l.key }

func (l *Linkage[T]) findByID(id int64) (parent, curr *LinkageItem[T]) {
	for _, item := range l.Items() {
		if item.ID == id {
			return nil, item
		} else {
			if parent, curr := item.find(id); curr != nil {
				return parent, curr
			}
		}
	}
	return nil, nil
}

func (l *LinkageItem[T]) find(id int64) (parent, curr *LinkageItem[T]) {
	for _, item := range l.Items {
		if item.ID == id {
			return l, item
		}
	}
	return nil, nil
}

func errLinkageItemNotFound(id int64) error {
	return web.NewLocaleError("linkage item %d not found", id)
}

func checkObjectType[T any]() {
	if reflect.TypeFor[T]().Kind() == reflect.Pointer {
		panic(fmt.Sprintf("T 的约束必须是结构体"))
	}
}
