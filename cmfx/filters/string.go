// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package filters

import (
	"github.com/issue9/web/filter"
	s "github.com/issue9/webfilter/sanitizer"
	v "github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/locales"
)

var (
	// Strength 密码强度规则
	Strength = filter.NewBuilder(s.S(s.Trim), v.V(v.Strength(8, 1, 0, 1), locales.StrengthInvalid))

	// Avatar 头像验证规则，可以为空或是 URL
	Avatar = filter.NewBuilder(s.S(s.Trim), v.V(v.Or(v.URL, v.Zero[string]), locales.InvalidValue))

	// NotEmpty 非空字符串
	NotEmpty = filter.NewBuilder(v.V(v.Not(v.Empty), locales.Required))

	// Empty 空字符串
	Empty = filter.NewBuilder(v.V(v.Empty, locales.MustBeEmpty))

	URL = filter.NewBuilder(v.V(v.URL, locales.InvalidURLFormat))
)

func EmptyOr(val func(string) bool) filter.Builder[string] {
	return filter.NewBuilder(v.V(v.Or(val), locales.InvalidValue))
}
