// SPDX-License-Identifier: MIT

// Package locales 本地化内容
package locales

import (
	"embed"

	"github.com/issue9/web"
	"github.com/issue9/web/locales"
)

//go:embed *.yaml
var Locales embed.FS

// 引用 github.com/issue9/web 的本地化内容
var WebLocales = locales.Locales

// 一些常用的翻译项
const (
	InvalidFormat    = web.StringPhrase("invalid format")
	InvalidURLFormat = web.StringPhrase("invalid url format")
	InvalidValue     = locales.InvalidValue
	Required         = web.StringPhrase("required")
	MustBeEmpty      = web.StringPhrase("must be empty")
	StrengthInvalid  = web.StringPhrase("strength invalid")
	NotInCandidate   = web.StringPhrase("the value not in candidate")
)
