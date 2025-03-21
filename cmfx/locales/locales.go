// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

// Package locales 本地化内容
package locales

import (
	"cmp"
	"embed"
	"io/fs"

	"github.com/issue9/web"
	"github.com/issue9/web/locales"
	wl "github.com/issue9/webuse/v7/locales"
)

//go:embed *.yaml
var locale embed.FS

var All = append([]fs.FS{locale, wl.Locales}, locales.Locales...)

// 一些常用翻译项
const (
	InvalidFormat    = locales.InvalidFormat
	InvalidURLFormat = web.StringPhrase("invalid url format")
	InvalidValue     = locales.InvalidValue
	Required         = locales.CanNotBeEmpty
	MustBeEmpty      = web.StringPhrase("must be empty")
	StrengthInvalid  = web.StringPhrase("strength invalid")
	NotInCandidate   = web.StringPhrase("the value not in candidate")
	NotFound         = locales.NotFound
)

func MustBeBetween[T cmp.Ordered](min, max T) web.LocaleStringer {
	return web.Phrase("must be between (%v,%v)", min, max)
}

func MustBeBetweenEqual[T cmp.Ordered](min, max T) web.LocaleStringer {
	return web.Phrase("must be between [%v,%v]", min, max)
}

func MustBeGreaterThan[T any](v T) web.LocaleStringer {
	return web.Phrase("must be greater than %v", v)
}

func MustBeLessThan[T any](v T) web.LocaleStringer {
	return web.Phrase("must be less than %v", v)
}

func ErrMustBeGreaterThan[T any](v T) error {
	return web.NewLocaleError("must be greater than %v", v)
}

func ErrInvalidValue() error { return locales.ErrInvalidValue() }

func ErrMustBeLessThan[T any](v T) error {
	return web.NewLocaleError("must be less than %v", v)
}

func ErrNotFound() error { return locales.ErrNotFound() }
