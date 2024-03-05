// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package query 查询操作
package query

import (
	"strings"
	"time"

	"github.com/issue9/web"
)

const dateFormat = "2006-01-02Z0700"

// Text 带分页的文字查询
type Text struct {
	Limit
	Text string `query:"text"`
}

// DateRange 时间范围
//
// 将查询参数中的 zone,start,end 转换成两个时间戳。
//
// zone 为时区，支持 ±[hh][mm] 格式，
// start 和 end 的格式只能是 [time.DateOnly]。
//
// @type string
type DateRange struct {
	Start time.Time
	End   time.Time
}

func (s *DateRange) UnmarshalQuery(data string) (err error) {
	if data == "" {
		return nil
	}

	strs := strings.Split(data, ",")
	if len(strs) < 2 {
		return nil
	}
	zone := strs[0]
	if zone[0] != '+' && zone[0] != '-' {
		zone = "+" + zone
	}

	if strs[1] != "" {
		s.Start, err = time.Parse(dateFormat, strs[1]+zone)
		if err != nil {
			return err
		}
	}

	if len(strs) < 3 {
		return nil
	}

	if strs[2] != "" {
		s.End, err = time.Parse(dateFormat, strs[2]+zone)
		if err != nil {
			return err
		}
	}

	if s.Start.After(s.End) {
		return web.NewLocaleError("invalid format")
	}

	return nil
}
