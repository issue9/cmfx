// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package filters

import (
	"slices"

	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx/locales"
)

var presetConfig *Config

// Config 可配置的一些过滤器
type Config struct {
	XMLName struct{} `xml:"config" json:"-" yaml:"-" cbor:"-" toml:"-" setting:"-"`

	// Keywords 按关键字过滤
	Keywords []string `xml:"keywords" json:"keywords" yaml:"keywords" cbor:"keywords" toml:"keywords" setting:"keywords" comment:"keyword filter"`

	// URLBlacklist  地址黑名单
	URLBlacklist []string `xml:"urlBlacklist" json:"urlBlacklist" yaml:"urlBlacklist" cbor:"urlBlacklist" toml:"urlBlacklist" setting:"urlBlacklist" comment:"url blacklist filter"`
}

// PresetConfig 默认的配置项
//
// 可通过此对象改变 [Keywords] 和 [URLBlacklist] 的验证规则。
func PresetConfig() *Config { return presetConfig }

// Keywords 按关键字过滤
//
// 关键字的内容由 [PresetConfig.Keywords] 提供。
func Keywords() filter.Builder[string] {
	return filter.NewBuilder(filter.V(func(v string) bool {
		if presetConfig == nil {
			return true
		}

		return slices.Index(presetConfig.Keywords, v) < 0
	}, locales.InvalidValue))
}

// URLBlacklist URL 黑名单
//
// 黑名单的内容由 [PresetConfig.URLBlacklist] 提供。
func URLBlacklist() filter.Builder[string] {
	return filter.NewBuilder(filter.V(func(v string) bool {
		if presetConfig == nil {
			return true
		}

		return slices.Index(presetConfig.URLBlacklist, v) < 0
	}, locales.InvalidValue))
}
