// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package initial

import (
	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/filters"
)

// Ratelimit API 访问限制
type Ratelimit struct {
	Prefix   string          `yaml:"prefix" json:"prefix" xml:"prefix"`            // 在缓存系统中前缀，保证数据的唯一性
	Rate     config.Duration `yaml:"rate" json:"rate" xml:"rate"`                  // 发放令牌的频率
	Capacity uint64          `yaml:"capacity" json:"capacity" xml:"capacity,attr"` // 令牌桶的最高容量
}

func (r *Ratelimit) SanitizeConfig() *web.FieldError {
	return filter.ToFieldError(
		filters.NotEmpty("prefix", &r.Prefix),
		filters.GreatEqual[config.Duration](0)("rate", &r.Rate),
		filters.GreatEqual[uint64](10)("capacity", &r.Capacity),
	)
}
