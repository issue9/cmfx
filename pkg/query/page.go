// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package query

import (
	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/filters"
)

// Page 分页对象
type Page[T any] struct {
	XMLName struct{} `json:"-" xml:"page"`
	Count   int64    `json:"count" xml:"count,attr"`                   // 符合条件的所有数据
	Current []*T     `json:"current"  xml:"current"`                   // 当前页的数据
	More    bool     `json:"more,omitempty" xml:"more,attr,omitempty"` // 是否还有更多的数据
}

// Limit 分页查询中总会带的查询参数
type Limit struct {
	Page int `query:"page,0"`  // 请求的页码，从 0 开始。
	Size int `query:"size,20"` // 每页的数量
}

func (l *Limit) Filter(v *web.FilterContext) {
	v.Add(filters.MinZero("page", &l.Page)).
		Add(filters.MinZero("size", &l.Size))
}

// PagingResponser 将分页对象封装成 [web.Responser]
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。最终给客户的数据为 []*T。
// f 用于对 *T 进行额外处理；
func PagingResponser[T any](ctx *web.Context, l *Limit, sql *sqlbuilder.SelectStmt, f func(*T)) web.Responser {
	p, err := Paging(l, sql, f)
	if err != nil {
		return ctx.Error(err, "")
	}
	if p == nil || p.Count == 0 || len(p.Current) == 0 {
		return ctx.NotFound()
	}
	return web.OK(p)
}

// PagingResponserWithConvert 将分页对象的元素通过 convert 转换之后封装成 [web.Responser]
//
// T 为从数据库读取的数据类型；
// R 为返回给客户端数据元素项的类型；
// convert 用于将 T 转换成 R 类型；
func PagingResponserWithConvert[T, R any](ctx *web.Context, l *Limit, sql *sqlbuilder.SelectStmt, convert func(*T) *R) web.Responser {
	p, err := Paging[T](l, sql, nil)
	if err != nil {
		return ctx.Error(err, "")
	}
	if p == nil || p.Count == 0 || len(p.Current) == 0 {
		return ctx.NotFound()
	}

	items := make([]*R, 0, len(p.Current))
	for _, item := range p.Current {
		items = append(items, convert(item))
	}

	return web.OK(&Page[R]{
		Count:   p.Count,
		Current: items,
		More:    p.More,
	})
}

// Paging 返回分页对象
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。最终给客户的数据为 []*T。
// f 用于对 *T 进行额外处理；
func Paging[T any](l *Limit, sql *sqlbuilder.SelectStmt, f func(*T)) (*Page[T], error) {
	offset := l.Page * l.Size
	sql.Limit(l.Size, offset)

	// 获取总数量
	count, err := sql.Count("count(*) as cnt").QueryInt("cnt")
	if err != nil {
		return nil, err
	}
	sql.Count("")
	if count == 0 {
		return nil, nil
	}

	curr := make([]*T, 0, l.Size)
	n, err := sql.QueryObject(true, &curr)
	if err != nil {
		return nil, err
	}
	if n == 0 {
		return nil, nil
	}

	if f != nil {
		for _, item := range curr {
			f(item)
		}
	}

	return &Page[T]{
		Count:   count,
		Current: curr,
		More:    int64(offset+n) < count,
	}, nil
}
