// SPDX-License-Identifier: MIT

// Package query 查询操作
package query

import (
	"strconv"
	"strings"
	"time"
)

// Text 带分页的文字查询
type Text struct {
	Limit
	Text string `query:"text"`
}

// DateRange 时间范围。
//
// 将查询参数中的  xx-xx 转换成两个时间戳。
//
// 其中 0 表示未传递过来。
type DateRange struct {
	Start time.Time
	End   time.Time
}

func (s *DateRange) UnmarshalQuery(data string) error {
	if data == "" {
		return nil
	}

	strs := strings.Split(data, "-")

	if len(strs) == 0 {
		return nil
	}

	if strs[0] != "" {
		start, err := strconv.ParseInt(strs[0], 10, 64)
		if err != nil {
			return err
		}
		s.Start = time.Unix(start, 0)
	}

	if len(strs) == 1 {
		return nil
	}

	if strs[1] != "" {
		end, err := strconv.ParseInt(strs[1], 10, 64)
		if err != nil {
			return err
		}
		s.End = time.Unix(end, 0)
	}

	return nil
}
