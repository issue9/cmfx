// SPDX-License-Identifier: MIT

package query

import (
	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/rules"
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

func (l *Limit) CTXSanitize(v *web.Validation) {
	v.AddField(l.Page, "page", rules.MinZero).AddField(l.Size, "size", rules.MinZero)
}

// PagingResponser 将分页对象封装成 [web.Responser]
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。最终给客户的数据为 []*T。
func PagingResponser[T any](ctx *web.Context, l *Limit, sql *sqlbuilder.SelectStmt) web.Responser {
	p, err := Paging[T](ctx, l, sql)
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if p == nil || p.Count == 0 || len(p.Current) == 0 {
		return ctx.NotFound()
	}
	return web.OK(p)
}

// Paging 返回分页对象
//
// T 为返回给客户端数据元素项的类型，必须为非指针类型。最终给客户的数据为 []*T。
func Paging[T any](ctx *web.Context, l *Limit, sql *sqlbuilder.SelectStmt) (*Page[T], error) {
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

	return &Page[T]{
		Count:   count,
		Current: curr,
		More:    int64(offset+n) < count,
	}, nil
}
