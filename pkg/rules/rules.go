// SPDX-License-Identifier: MIT

// Package rules 一些通用的验证规则
package rules

import (
	"reflect"

	"github.com/issue9/validator"
	"github.com/issue9/web/server"

	"github.com/issue9/cmfx/locales"
)

var (
	Required = server.NewRuleFunc(locales.Required, func(a any) bool {
		if a == nil {
			return false
		}
		return !reflect.ValueOf(a).IsZero()
	})

	Strength = server.NewRule(locales.StrengthInvalid, validator.Strength(8, 1, 0, 1))

	// Avatar 头像验证规则，可以为空或是 URL
	Avatar = server.NewRule(locales.InvalidValue, validator.OrFunc(validator.URL, func(a any) bool {
		if a == nil {
			return true
		}
		switch v := a.(type) {
		case string:
			return v == ""
		case []byte:
			return len(v) == 0
		case []rune:
			return len(v) == 0
		default:
			return false
		}
	}))
)
