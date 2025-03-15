// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

// Package query 查询操作的相关功能
package query

import (
	"strings"
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/filters"
)

const dateLayout = time.RFC3339

// DateRange 日期范围的查询参数
//
// 格式为 start~end，start 和 end 都表示日期，格式为：[time.RFC3339]，
// start 和 end 都可省略，如果没有 ~ 表示只 start，如果只需要 end，可以用 ~end。
type DateRange struct {
	Start time.Time
	End   time.Time
}

func (r *DateRange) UnmarshalQuery(data string) (err error) {
	if data == "" || data == "~" {
		return nil
	}

	switch index := strings.IndexByte(data, '~'); {
	case index == -1:
		if r.Start, err = time.Parse(dateLayout, data); err != nil {
			return err
		}
	case index == 0:
		if r.End, err = time.Parse(dateLayout, data[1:]); err != nil {
			return err
		}
	case index == len(data)-1:
		if r.Start, err = time.Parse(dateLayout, data[:len(data)-1]); err != nil {
			return err
		}
	default:
		if r.Start, err = time.Parse(dateLayout, data[:index]); err != nil {
			return err
		}
		if r.End, err = time.Parse(dateLayout, data[index+1:]); err != nil {
			return err
		}
	}

	return nil
}

func (r *DateRange) Filter(ctx *web.FilterContext) {
	if r.Start.IsZero() && r.End.IsZero() && r.End.Before(r.Start) {
		ctx.AddError("end", web.NewLocaleError("query param end time must be after start time"))
	}
}

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
