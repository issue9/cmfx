// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package filters

import (
	"github.com/issue9/web/filter"
	"github.com/issue9/webfilter/validator"
	v "github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/cmfx/locales"
)

type Number interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64 |
		~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64 |
		float32 | float64
}

// GreatEqualZero 大于 0
var GreatEqualZero = GreatEqual(0)

// NotZeroNumber 是否为 !0
func NotZeroNumber[T Number]() filter.Builder[T] {
	return filter.NewBuilder(v.V(v.Not(func(val T) bool { return val == 0 }), locales.Required))
}

// ZeroNumber 是否为 0
func ZeroNumber[T Number]() filter.Builder[T] {
	return filter.NewBuilder[T](v.V(func(val T) bool { return val == 0 }, locales.MustBeEmpty))
}

// ZeroNumberOr 是否为 0 或是 v
func ZeroNumberOr[T Number](validator func(T) bool) filter.Builder[T] {
	return filter.NewBuilder[T](v.V(v.Or(func(val T) bool { return val == 0 }, validator), locales.InvalidValue))
}

func GreatEqual[T Number](n T) filter.Builder[T] {
	return filter.NewBuilder(v.V(v.GreatEqual(n), locales.MustBeGreaterThan(float64(n))))
}

func LessEqual[T Number](n T) filter.Builder[T] {
	return filter.NewBuilder(v.V(v.LessEqual(n), locales.MustBeLessThan(float64(n))))
}

func Between[T Number](min, max T) filter.Builder[T] {
	return filter.NewBuilder(v.V(validator.Between(min, max), locales.MustBeBetween(min, max)))
}

func BetweenEqual[T Number](min, max T) filter.Builder[T] {
	return filter.NewBuilder(v.V(validator.BetweenEqual(min, max), locales.MustBeBetweenEqual(min, max)))
}
