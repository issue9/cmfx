// SPDX-License-Identifier: MIT

package linkage

import "github.com/issue9/sliceutil"

type Item[T any] struct {
	ID    int64
	Data  T
	Items []*Item[T]
}

type Root[T any] struct {
	// TODO 缓存输出的 []byte 内容
	linkage *Linkage
	key     string

	Item[T]
}

func NewRoot[T any](l *Linkage, key string) *Root[T] {
	return &Root[T]{
		linkage: l,
		key:     key,
	}
}

// Load 从数据库加载项
func (r *Root[T]) Load() error {
	items := make([]*Item[T], 0, 100)
	_, err := r.linkage.dbPrefix.DB(r.linkage.db).
		Where("key=?", r.key).
		AndIsNull("deleted").
		Select(true, &items)
	if err != nil {
		return err
	}

	for _, item := range items {
		for _, item2 := range items {
			if item.ID == item2.ID {
				item.Items = append(item.Items, item2)
			}
		}
	}
	r.Items = items

	return nil
}

// Delete 删除一项数据
//
// id 表示数据项的 ID，可以是 [Root.Items] 下的任意层级数据。
func (r *Root[T]) Delete(id int64) error {
	p, _, found := r.findItem(id)
	if !found {
		return ErrNotFound()
	}

	_, err := r.linkage.dbPrefix.DB(r.linkage.db).Delete(&linkageModel{ID: id})
	if err != nil {
		return err
	}

	p.Items = sliceutil.Delete(p.Items, func(i *Item[T]) bool { return i.ID == id })

	return nil
}

// Update 更新数据
//
// id 表示数据项的 ID，可以是 [Root.Items] 下的任意层级数据。
func (r *Root[T]) Update(id int64, val T) error {
	_, item, found := r.findItem(id)
	if !found {
		return ErrNotFound()
	}

	data, err := marshal(val)
	if err != nil {
		return err
	}

	item.Data = val
	_, err = r.linkage.dbPrefix.DB(r.linkage.db).Update(&linkageModel{
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
func (r *Root[T]) Add(parent int64, val T) error {
	_, item, found := r.findItem(parent)
	if !found {
		return ErrNotFound()
	}

	data, err := marshal(val)
	if err != nil {
		return err
	}

	id, err := r.linkage.dbPrefix.DB(r.linkage.db).LastInsertID(&linkageModel{
		Data:   data,
		Key:    r.key,
		Parent: parent,
	})
	if err != nil {
		return err
	}

	item.Items = append(item.Items, &Item[T]{
		ID:   id,
		Data: val,
	})

	return nil
}

func (r *Root[T]) findItem(id int64) (parent, current *Item[T], found bool) {
	if id == r.ID {
		return nil, &r.Item, true
	}
	return findItem(&r.Item, id)
}

func findItem[T any](item *Item[T], id int64) (parent, current *Item[T], found bool) {
	for _, i := range item.Items {
		if parent, current, found = findItem(i, id); found {
			return
		}
	}
	return nil, nil, false
}
