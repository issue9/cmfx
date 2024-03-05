// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package filters

import (
	"github.com/issue9/filter/sanitizer"
	"github.com/issue9/filter/validator"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
)

var (
	// Strength 密码强度规则
	Strength = web.NewFilter(web.NewRule(validator.Strength(8, 1, 0, 1), locales.StrengthInvalid), sanitizer.Trim)

	// Avatar 头像验证规则，可以为空或是 URL
	Avatar = web.NewFilter(web.NewRule(validator.Or(validator.URL, validator.Zero[string]), locales.InvalidValue), sanitizer.Trim)

	RequiredString = web.NewFilter(web.NewRule(validator.Not(validator.Zero[string]), locales.Required))

	URL = web.NewFilterFromVS(locales.InvalidURLFormat, validator.URL)
)

func EmptyOr(v func(string) bool, s ...func(*string)) web.FilterFuncOf[string] {
	return web.NewFilterFromVS(locales.InvalidValue, validator.EmptyOr(v), s...)
}
