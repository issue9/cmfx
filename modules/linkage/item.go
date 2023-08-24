// SPDX-License-Identifier: MIT

package linkage

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/issue9/sliceutil"
)

type Item[T any] struct {
	ID     int64      `json:"id" xml:"id,attr" yaml:"id"`
	Data   T          `json:"data" xml:"data" yaml:"data"`
	Items  []*Item[T] `json:"items,omitempty" xml:"items,omitempty" yaml:"items,omitempty"`
	parent int64
}

// TODO 缓存输出的 []byte 内容
type Root[T any] struct {
	linkage *Linkage
	key     string
	Item[T]
}

// NewRoot 声明联动数据
//
// T 为每个数据的类型，此值必须实现 json.Unmarshal 接口；
func NewRoot[T any](l *Linkage, key string) *Root[T] {
	return &Root[T]{
		linkage: l,
		key:     key,
	}
}

// Load 从数据库加载项
func (r *Root[T]) Load() error {
	mods := make([]*linkageModel, 0, 100)
	_, err := r.linkage.DBEngine(nil).
		Where("key=?", r.key).
		AndIsNull("deleted").
		Select(true, &mods)
	if err != nil {
		return err
	}

	// 转换成 []*Item[T]
	items := make([]*Item[T], 0, len(mods))
	for _, item := range mods {
		if item.Data == nil {
			continue
		}

		var data T
		if err := unmarshal(item.Data, &data); err != nil {
			return err
		}

		items = append(items, &Item[T]{
			ID:     item.ID,
			Data:   data,
			Items:  make([]*Item[T], 0, 100),
			parent: item.Parent,
		})
	}

	for _, item1 := range items {
		for _, item2 := range items {
			if item2.parent == item1.ID {
				item1.Items = append(item1.Items, item2)
			}
		}
		if item1.parent == 0 {
			if r.ID != 0 {
				panic(fmt.Sprintf("同时存在多个顶级元素,%d,%d", r.ID, item1.ID))
			}
			r.ID = item1.ID
			r.Data = item1.Data
			r.Items = item1.Items
		}
	}

	return nil
}

// Delete 删除一项数据
//
// id 表示数据项的 ID，可以是 [Root.Items] 下的任意层级数据。
// 不能删除 Root 自身。
func (r *Root[T]) Delete(id int64) error {
	if id == 0 || id == r.ID {
		return ErrNotFound()
	}

	item, found := r.Get(id)
	if !found {
		return ErrNotFound()
	}
	p, found := r.Get(item.parent)
	if !found {
		return ErrNotFound()
	}

	data := &linkageModel{ID: id, Deleted: sql.NullTime{Time: time.Now()}}
	if _, err := r.linkage.DBEngine(nil).Update(data); err != nil {
		return err
	}

	p.Items = sliceutil.Delete(p.Items, func(i *Item[T], _ int) bool { return i.ID == id })

	return nil
}

// Update 更新数据
//
// id 表示数据项的 ID，可以是 [Root.Items] 下的任意层级数据。
// 如果 id 为零值，表示 Root 自身。
func (r *Root[T]) Update(id int64, val T) error {
	if id == 0 {
		id = r.ID
	}

	item, found := r.Get(id)
	if !found {
		return ErrNotFound()
	}

	data, err := marshal(val)
	if err != nil {
		return err
	}

	item.Data = val
	_, err = r.linkage.DBEngine(nil).Update(&linkageModel{
		ID:   id,
		Data: data,
	})
	if err != nil {
		return err
	}

	return nil
}

// Add 添加数据项
//
// id 表示上一级数据项的 ID，可以是 [Root.Items] 下的任意层级数据。
// 如果 id 为零值，那么将被添加根元素之下。
func (r *Root[T]) Add(parent int64, val ...T) error {
	if parent == 0 {
		parent = r.ID
	}

	item, found := r.Get(parent)
	if !found {
		return ErrNotFound()
	}

	data, err := marshal(val)
	if err != nil {
		return err
	}

	id, err := r.linkage.DBEngine(nil).LastInsertID(&linkageModel{
		Data:   data,
		Key:    r.key,
		Parent: parent,
	})
	if err != nil {
		return err
	}

	for _, v := range val {
		item.Items = append(item.Items, &Item[T]{
			ID:     id,
			Data:   v,
			parent: parent,
		})
	}

	return nil
}

func (r *Root[T]) Get(id int64) (current *Item[T], found bool) {
	return findItem(&r.Item, id)
}

func findItem[T any](item *Item[T], id int64) (*Item[T], bool) {
	if item.ID == id {
		return item, true
	}

	for _, i := range item.Items {
		if current, found := findItem(i, id); found {
			return current, true
		}
	}
	return nil, false
}
