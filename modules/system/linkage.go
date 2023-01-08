// SPDX-License-Identifier: MIT

package system

import (
	"database/sql"
	"fmt"
	"sync"
	"time"

	"github.com/issue9/orm/v5"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/locales"
)

type Linkage struct {
	id    int64
	name  string
	items []*Linkage

	root   *rootLinkage
	locker sync.RWMutex
}

type rootLinkage struct {
	top    *Linkage
	all    []*Linkage
	locker sync.RWMutex // 管理 all 的读写

	db *orm.DB
	p  orm.Prefix
}

type linkageResponse struct {
	ID    int64              `json:"id" xml:"id,attr"`
	Name  string             `json:"name" xml:"name"`
	Items []*linkageResponse `json:"items,omitempty" xml:"item,omitempty"`
}

func (s *System) Linkage() *Linkage { return s.linkages.top }

func newRootLinkage(db *orm.DB, p orm.Prefix) (*rootLinkage, error) {
	ls := make([]*linkage, 0, 10)
	_, err := p.DB(db).Where("deleted IS NULL").Select(true, &ls)
	if err != nil {
		return nil, web.NewStackError(err)
	}

	type subLinkage struct {
		l      *Linkage
		parent int64
	}

	all := make([]*Linkage, 0, len(ls)+1)
	top := make([]*Linkage, 0, 50)
	sub := make([]*subLinkage, 0, len(ls))
	root := &rootLinkage{
		db: db,
		p:  p,
	}

	for _, i := range ls {
		item := &Linkage{
			id:   i.ID,
			name: i.Name,
			root: root,
		}

		all = append(all, item)
		if i.Parent == 0 {
			top = append(top, item)
		} else {
			sub = append(sub, &subLinkage{l: item, parent: i.Parent})
		}
	}

	for _, s := range sub {
		p, found := sliceutil.At(all, func(e *Linkage) bool { return e.id == s.parent })
		if !found {
			return nil, fmt.Errorf("元素 %d 的父元素 %d 不存在", s.l.id, s.parent)
		}
		p.items = append(p.items, s.l)
	}

	root.top = &Linkage{
		items: top,
		root:  root,
	}
	root.all = append(all, root.top)

	return root, nil
}

func (l *Linkage) ID() int64 { return l.id }

func (l *Linkage) GetItem(id int64) *Linkage {
	l.locker.RLock()
	defer l.locker.RUnlock()

	item, _ := sliceutil.At(l.items, func(e *Linkage) bool { return e.id == id })
	return item
}

func (l *Linkage) AddItem(name string) (*Linkage, error) {
	l.locker.Lock()
	defer l.locker.Unlock()

	// 插入数据库

	db := l.root.p.DB(l.root.db)

	id, err := db.LastInsertID(&linkage{
		Name:   name,
		Parent: l.id,
	})
	if err != nil {
		return nil, err
	}

	// 更新内存数据

	li := &Linkage{
		id:   id,
		name: name,
		root: l.root,
	}
	l.items = append(l.items, li)

	l.root.locker.Lock()
	defer l.root.locker.Unlock()
	l.root.all = append(l.root.all, li)

	return li, nil
}

func (l *Linkage) AddItems(name ...string) error {
	if len(name) == 0 {
		return nil
	}

	for _, n := range name {
		if _, err := l.AddItem(n); err != nil {
			return err
		}
	}
	return nil
}

func (l *Linkage) SetItem(id int64, name string) error {
	l.locker.RLock() // 并不改变整个树结构，用读锁也没有大问题
	defer l.locker.RUnlock()

	// 更新数据库
	db := l.root.p.DB(l.root.db)
	if _, err := db.Update(&linkage{ID: id, Name: name}); err != nil {
		return err
	}

	item, found := sliceutil.At(l.items, func(e *Linkage) bool { return e.id == id })
	if !found {
		panic(fmt.Sprintf("数据库与内存数据不同，缺少了 %d", id))
	}
	item.name = name

	return nil
}

func (l *Linkage) DeleteItem(id int64) error {
	l.locker.Lock()
	defer l.locker.Unlock()

	// 更新数据库
	db := l.root.p.DB(l.root.db)
	if _, err := db.Update(&linkage{ID: id, Deleted: sql.NullTime{Time: time.Now(), Valid: true}}); err != nil {
		return err
	}

	item, found := sliceutil.At(l.items, func(e *Linkage) bool { return e.id == id })
	if found && len(item.items) > 0 {
		return fmt.Errorf("%d 包含子元素，不能删除！", id)
	}

	l.items = sliceutil.Delete(l.items, func(e *Linkage) bool { return e.id == id })

	l.root.locker.Lock()
	defer l.root.locker.Unlock()
	l.root.all = sliceutil.Delete(l.root.all, func(e *Linkage) bool { return e.id == id })

	return nil
}

func (l *Linkage) toResponse() *linkageResponse {
	items := make([]*linkageResponse, 0, len(l.items))
	for _, item := range l.items {
		items = append(items, &linkageResponse{
			ID:   item.id,
			Name: item.name,
		})
	}
	return &linkageResponse{
		ID:    l.id,
		Name:  l.name,
		Items: items,
	}
}

// PutHandle 修改当前项内容
func (l *Linkage) PutHandle(ctx *web.Context) web.Responser {
	data := &struct {
		Name string `json:"name" xml:"name"`
	}{}
	if data.Name == "" {
		p := ctx.Problem(cmfx.BadRequestInvalidBody)
		p.AddParam("name", locales.Required.LocaleString(ctx.LocalePrinter()))
		return p
	}

	l.name = data.Name
	return web.NoContent()
}

// GetHandle 展示当前链表以及一级子项内容
func (l *Linkage) GetHandle(ctx *web.Context) web.Responser {
	if l == nil {
		return ctx.NotFound()
	}
	return web.OK(l.toResponse())
}

// <api method="GET" summary="指定 ID 的级联数据">
//
//	<path path="/system/linkages/{id}">
//	    <param name="id" type="number" summary="ID" />
//	</path>
//	<response status="200" type="object">
//	    <param name="id" type="id" summary="id" />
//	    <param name="key" type="string" summary="key" />
//	    <param name="name" type="string" summary="name" />
//	    <param name="item" type="object" array="true" summary="子项">
//	        <param name="id" type="id" summary="id" />
//	        <param name="key" type="string" summary="key" />
//	        <param name="name" type="string" summary="name" />
//	    </param>
//	</response>
//
// </api>
func (s *System) adminGetLinkages(ctx *web.Context) web.Responser {
	id, resp := ctx.ParamInt64("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	s.linkages.locker.RLock()
	defer s.linkages.locker.RUnlock()

	item, _ := sliceutil.At(s.linkages.all, func(e *Linkage) bool { return e.id == id })
	return web.OK(item.toResponse())
}
