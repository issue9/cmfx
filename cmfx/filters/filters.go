// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package filters 通用过滤器
package filters

import (
	"github.com/issue9/web/filter"
	v "github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/locales"
)

func NilOr[T any](validator func(T) bool) filter.Builder[T] {
	return filter.NewBuilder(v.V(v.Or(validator, v.Nil), locales.InvalidValue))
}

func Nil[T any]() filter.Builder[T] {
	return filter.NewBuilder(v.V[T](v.Nil, locales.MustBeEmpty))
}

// NotZero 非零值
func NotZero[T any]() filter.Builder[T] {
	return filter.NewBuilder(v.V(v.Not(v.Zero[T]), locales.Required))
}

func Zero[T any]() filter.Builder[T] {
	return filter.NewBuilder(v.V(v.Zero[T], locales.Required))
}

func Equal[T comparable](val T) filter.Builder[T] {
	return filter.NewBuilder(v.V(v.Equal(val), locales.InvalidValue))
}

func NotEqual[T comparable](val T) filter.Builder[T] {
	return filter.NewBuilder(v.V(v.Not(v.Equal(val)), locales.InvalidValue))
}
