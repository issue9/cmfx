// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package linkages

import (
	"database/sql"
	"slices"
	"time"

	"github.com/issue9/cache"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

// Module 管理一组带有层级关系的链表
type Module struct {
	mod     *cmfx.Module
	db      *orm.DB
	cacheID string
}

// Load 加载 [Module] 对象
//
// mod 所属的模块；tableName 表名的后缀部分；
func Load(mod *cmfx.Module, tableName string) *Module {
	db := buildDB(mod, tableName)

	all := make([]*linkagePO, 0, 10)
	if _, err := db.Where("deleted IS NULL").Select(true, &all); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	if len(all) == 0 {
		panic(mod.Server().Locale().Printer().Sprintf("no data"))
	}

	items, all := getItems(0, all)
	root := items[0]
	buildItems(root, all)

	cacheID := mod.Server().UniqueID()
	if err := mod.Server().Cache().Set(cacheID, root, cache.Forever); err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	return &Module{
		mod:     mod,
		db:      db,
		cacheID: cacheID,
	}
}

func buildItems(v *LinkageVO, all []*linkagePO) []*linkagePO {
	v.Items, all = getItems(v.ID, all)
	for _, item := range v.Items {
		all = buildItems(item, all)
	}

	return all
}

func sort(items []*LinkageVO) {
	slices.SortFunc(items, func(a, b *LinkageVO) int { return a.Order - b.Order })
}

func getItems(p int64, all []*linkagePO) ([]*LinkageVO, []*linkagePO) {
	items := make([]*LinkageVO, 0, 10)
	for _, item := range all {
		if item.Parent == p {
			items = append(items, &LinkageVO{
				ID:    item.ID,
				Title: item.Title,
				Icon:  item.Icon,
				Order: item.Order,
				Count: item.Count,
			})
		}
	}
	sort(items)

	return items, slices.DeleteFunc(all, func(item *linkagePO) bool { // 删除所有已经在 items 中的项
		return slices.IndexFunc(items, func(e *LinkageVO) bool { return e.ID == item.ID }) >= 0
	})
}

// Get 获得所有内容
func (m *Module) Get() (*LinkageVO, error) {
	root := &LinkageVO{}
	if err := m.mod.Server().Cache().Get(m.cacheID, root); err != nil {
		return nil, err
	}
	return root, nil
}

// Set 修改 id 指向的对象
func (m *Module) Set(id int64, title, icon string, order int) error {
	root, err := m.Get()
	if err != nil {
		return err
	}

	item, p := findRoot(id, root)
	item.Title = title
	item.Icon = icon
	item.Order = order

	if p != nil {
		sort(p.Items) // 重新排序
	}

	// 保存到数据库
	po := &linkagePO{
		ID:    id,
		Title: title,
		Icon:  icon,
		Order: order,
	}
	if _, err := m.db.Update(po, "title", "icon", "order"); err != nil {
		return err
	}

	// 保存到缓存
	return m.mod.Server().Cache().Set(m.cacheID, root, cache.Forever)
}

// Delete 删除指定的项
//
// 一旦删除，所有的子项也将不可用。
func (m *Module) Delete(id int64) error {
	root, err := m.Get()
	if err != nil {
		return err
	}

	_, p := findRoot(id, root)
	p.Items = slices.DeleteFunc(p.Items, func(e *LinkageVO) bool { return e.ID == id })
	if p != nil {
		sort(p.Items) // 重新排序
	}

	po := &linkagePO{ID: id, Deleted: sql.NullTime{Valid: true, Time: time.Now()}}
	if _, err := m.db.Update(po); err != nil {
		return err
	}

	// 保存到缓存
	return m.mod.Server().Cache().Set(m.cacheID, root, cache.Forever)
}

// AddCount 添加计数
//
// delta 增加的数量，可以为负数；
func (m *Module) AddCount(id int64, delta int) error {
	root, err := m.Get()
	if err != nil {
		return err
	}

	curr, _ := findRoot(id, root)
	curr.Count++

	if _, err := m.db.Update(&linkagePO{ID: id, Count: curr.Count}, "count"); err != nil {
		return err
	}

	// 保存到缓存
	return m.mod.Server().Cache().Set(m.cacheID, root, cache.Forever)
}

// Add 向 parent 添加一个子项
func (m *Module) Add(parent int64, title, icon string, order int) error {
	root, err := m.Get()
	if err != nil {
		return err
	}

	p, _ := findRoot(parent, root)

	// 写入数据库
	po := &linkagePO{
		Title:  title,
		Icon:   icon,
		Parent: p.ID,
		Order:  order,
	}
	id, err := m.db.LastInsertID(po)
	if err != nil {
		return err
	}

	// 重新保存到缓存
	p.Items = append(p.Items, &LinkageVO{
		ID:    id,
		Title: title,
		Icon:  icon,
		Order: order,
	})
	sort(p.Items)
	return m.mod.Server().Cache().Set(m.cacheID, root, cache.Forever)
}

func findRoot(id int64, root *LinkageVO) (curr, parent *LinkageVO) {
	if id == root.ID {
		return root, nil
	}
	return find(id, root)
}

func find(id int64, p *LinkageVO) (curr, parent *LinkageVO) {
	for _, item := range p.Items {
		if item.ID == id {
			return item, p
		}

		if len(item.Items) > 0 {
			return find(id, item)
		}
	}
	return nil, nil
}
