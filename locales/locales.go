// SPDX-License-Identifier: MIT

// Package locales 本地化内容
package locales

import (
	"embed"

	"github.com/issue9/web"
)

//go:embed *.yaml
var Locales embed.FS

// 一些常用的翻译项
var (
	InvalidValue          = web.Phrase("invalid value")
	Required              = web.Phrase("required")
	MustBeGreaterThanZero = web.Phrase("must be greater than zero")
	StrengthInvalid       = web.Phrase("strength invalid")
	NotInCandidate        = web.Phrase("the value not in candidate")
)
