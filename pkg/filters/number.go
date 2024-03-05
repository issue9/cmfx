// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package filters

import (
	"github.com/issue9/filter/validator"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
)

var (
	MinZero = MinNumber(0)
)

func RequiredNumber[T validator.Number]() web.FilterFuncOf[T] {
	return web.NewFilter(web.NewRule(validator.Not(validator.Zero[T]), locales.Required))
}

func MinNumber[T validator.Number](n T) web.FilterFuncOf[T] {
	return web.NewFilter(web.NewRule(validator.GreatEqual(n), web.Phrase("must be greater than %d", n)))
}

func MaxNumber[T validator.Number](n T) web.FilterFuncOf[T] {
	return web.NewFilter(web.NewRule(validator.LessEqual(n), web.Phrase("must be less than %d", n)))
}

func ZeroOr[T validator.Number](v func(T) bool) web.FilterFuncOf[T] {
	return web.NewFilter(web.NewRule(validator.ZeroOr(v), locales.InvalidValue))
}
