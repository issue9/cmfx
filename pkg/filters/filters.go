// SPDX-License-Identifier: MIT

// Package filters 通用过滤器
package filters

import (
	"github.com/issue9/filter/sanitizer"
	"github.com/issue9/filter/validator"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/locales"
)

var (
	// Strength 密码强度规则
	Strength = filter.New(filter.NewRule(validator.Strength(8, 1, 0, 1), locales.StrengthInvalid), sanitizer.Trim)

	// Avatar 头像验证规则，可以为空或是 URL
	Avatar = filter.New(filter.NewRule(validator.Or(validator.URL, validator.Zero[string]), locales.InvalidValue), sanitizer.Trim)

	RequiredString = filter.New(filter.NewRule(validator.Not(validator.Zero[string]), locales.Required))
)
