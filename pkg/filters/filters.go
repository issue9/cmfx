// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package filters 通用过滤器
package filters

import (
	"github.com/issue9/filter/validator"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
)

func NilOr[T any](v func(T) bool) web.FilterFuncOf[T] {
	return web.NewFilterFromVS(locales.InvalidValue, validator.NilOr(v))
}

func Nil[T any]() web.FilterFuncOf[T] {
	return web.NewFilterFromVS(locales.MustBeEmpty, validator.Zero[T])
}

func Required[T any]() web.FilterFuncOf[T] {
	return web.NewFilterFromVS(locales.Required, validator.Not(validator.Zero[T]))
}

func Equal[T comparable](v T) web.FilterFuncOf[T] {
	return web.NewFilterFromVS(locales.InvalidValue, validator.Equal(v))
}

func NotEqual[T comparable](v T) web.FilterFuncOf[T] {
	return web.NewFilterFromVS(locales.InvalidValue, validator.Not(validator.Equal(v)))
}
