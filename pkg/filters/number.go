// SPDX-License-Identifier: MIT

package filters

import (
	"github.com/issue9/filter/validator"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/locales"
)

var (
	MinZero = MinNumber(0)
)

func RequiredNumber[T validator.Number]() filter.FilterFuncOf[T] {
	return filter.New(filter.NewRule(validator.Not(validator.Zero[T]), locales.Required))
}

func MinNumber[T validator.Number](n T) filter.FilterFuncOf[T] {
	return filter.New(filter.NewRule(validator.GreatEqual(n), web.Phrase("must be greater than %d", n)))
}

func MaxNumber[T validator.Number](n T) filter.FilterFuncOf[T] {
	return filter.New(filter.NewRule(validator.LessEqual(n), web.Phrase("must be less than %d", n)))
}

func ZeroOr[T validator.Number](v filter.ValidatorFuncOf[T]) filter.FilterFuncOf[T] {
	return filter.New(filter.NewRule(validator.ZeroOr(v), locales.InvalidValue))
}
