// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package query

import (
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/web"
)

// Page 分页对象
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。
type Page[T any] struct {
	XMLName struct{} `json:"-" xml:"page" cbor:"-" yaml:"-"`
	Count   int64    `json:"count" xml:"count,attr" cbor:"count" yaml:"count"`                                     // 符合条件的所有数据
	Current []*T     `json:"current"  xml:"current" cbor:"current" yaml:"current"`                                 // 当前页的数据
	More    bool     `json:"more,omitempty" xml:"more,attr,omitempty" cbor:"more,omitempty" yaml:"more,omitempty"` // 是否还有更多的数据
}

// PagingResponser 将分页对象封装成 [web.Responser]
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。
// f 用于对当前页的每一个数据 *T 进行额外处理；
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
// T 为从数据库读取的数据类型，R 为返回给客户端数据元素项的类型。两者都不能为指针类型；
// convert 用于将当前页的每个数据 *T 转换成 *R 类型；
func PagingResponserWithConvert[T, R any](ctx *web.Context, l *Limit, sql *sqlbuilder.SelectStmt, convert func(*T) *R) web.Responser {
	p, err := PagingWithConvert(l, sql, convert)
	if err != nil {
		return ctx.Error(err, "")
	}
	if p == nil || p.Count == 0 || len(p.Current) == 0 {
		return ctx.NotFound()
	}

	return web.OK(p)
}

// Paging 返回分页对象
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。最终给客户的数据为 []*T。
// f 用于对当前页的每一个元素 *T 进行额外处理；
func Paging[T any](l *Limit, sql *sqlbuilder.SelectStmt, f func(*T)) (*Page[T], error) {
	offset := l.Page * l.Size
	sql.Limit(l.Size, offset)

	// 获取总数量
	count, err := sql.Count("count(*) AS cnt").QueryInt("cnt")
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

// PagingWithConvert 返回分页对象
//
// T 为从数据库读取的数据类型，R 为返回给客户端数据元素项的类型。两者都不能为指针类型；
// f 用于对当前页的每一个元素 *T 进行额外处理；
func PagingWithConvert[T, R any](l *Limit, sql *sqlbuilder.SelectStmt, f func(*T) *R) (*Page[R], error) {
	p, err := Paging[T](l, sql, nil)
	if err != nil {
		return nil, err
	}

	if p == nil {
		return nil, nil
	}

	curr := make([]*R, 0, len(p.Current))
	for _, item := range p.Current {
		curr = append(curr, f(item))
	}

	return &Page[R]{
		Count:   p.Count,
		Current: curr,
		More:    p.More,
	}, nil
}
