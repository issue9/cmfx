// SPDX-License-Identifier: MIT

// Package filters 通用过滤器
package filters

import (
	"github.com/issue9/filter/validator"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/locales"
)

func NilOr[T any](v func(T) bool) filter.FilterFuncOf[T] {
	return filter.NewFromVS(locales.InvalidValue, validator.NilOr(v))
}

func Nil[T any]() filter.FilterFuncOf[T] {
	return filter.NewFromVS(locales.MustBeEmpty, validator.Zero[T])
}

func Required[T any]() filter.FilterFuncOf[T] {
	return filter.NewFromVS(locales.Required, validator.Not(validator.Zero[T]))
}

func Equal[T comparable](v T) filter.FilterFuncOf[T] {
	return filter.NewFromVS(locales.InvalidValue, validator.Equal(v))
}

func NotEqual[T comparable](v T) filter.FilterFuncOf[T] {
	return filter.NewFromVS(locales.InvalidValue, validator.Not(validator.Equal(v)))
}
