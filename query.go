// SPDX-License-Identifier: MIT

package cmfx

import (
	"strconv"
	"strings"
	"time"

	"github.com/issue9/localeutil"
	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/web"
)

const defaultPageSize = 20

// Limit 分页查询中总会带的查询参数
type Limit struct {
	Page int `query:"page,0"`
	Size int `query:"size,20"`
}

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

// CTXSanitize 实现查询参数的验证
func (l *Limit) CTXSanitize(ctx *web.Context, v *web.Validation) {
	if l.Page < 0 {
		v.Add("page", localeutil.Phrase("必须大于 0"))
	}

	if l.Size == 0 {
		l.Size = defaultPageSize
	}

	if l.Size < 0 {
		v.Add("size", localeutil.Phrase("必须大于 0"))
	}
}

// Paging 获取分页信息
//
// count 表示符合条件的数量；
// curr 表示当前页的数量；
func (l *Limit) Paging(sql *sqlbuilder.SelectStmt) (count, curr int64, err error) {
	sql.Limit(l.Size, l.Page*l.Size)

	// 获取总数量
	count, err = sql.Count("count(*) as cnt").QueryInt("cnt")
	if err != nil {
		return 0, 0, err
	}
	sql.Count("")

	return count, curr, nil
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
