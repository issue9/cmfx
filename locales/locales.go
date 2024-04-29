// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package locales 本地化内容
package locales

import (
	"embed"
	"io/fs"

	"github.com/issue9/web"
	"github.com/issue9/web/locales"
)

//go:embed *.yaml
var locale embed.FS

var All = append([]fs.FS{locale}, locales.Locales...)

// 一些常用的翻译项
const (
	InvalidFormat    = locales.InvalidFormat
	InvalidURLFormat = web.StringPhrase("invalid url format")
	InvalidValue     = locales.InvalidValue
	Required         = locales.CanNotBeEmpty
	MustBeEmpty      = web.StringPhrase("must be empty")
	StrengthInvalid  = web.StringPhrase("strength invalid")
	NotInCandidate   = web.StringPhrase("the value not in candidate")
	NotFound         = web.StringPhrase("not found")
)

func MustBeGreaterThan[T any](v T) web.LocaleStringer {
	return web.Phrase("must be greater than %v", v)
}

func MustBeLessThan[T any](v T) web.LocaleStringer {
	return web.Phrase("must be less than %v", v)
}
