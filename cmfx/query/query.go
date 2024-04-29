// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package query 查询操作的相关功能
package query

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/filters"
)

// Text 带分页的文字查询
type Text struct {
	Limit
	Text string `query:"text"`
}

// Limit 分页查询中总会带的查询参数
type Limit struct {
	Page int `query:"page,0"`  // 请求的页码，从 0 开始。
	Size int `query:"size,20"` // 每页的数量
}

func (l *Limit) Filter(v *web.FilterContext) {
	v.Add(filters.GreatEqualZero("page", &l.Page)).
		Add(filters.GreatEqualZero("size", &l.Size))
}
