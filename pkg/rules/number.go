// SPDX-License-Identifier: MIT

package rules

import (
	"github.com/issue9/validator"
	"github.com/issue9/web"
)

var (
	MinZero = MinNumber(0)
)

func MinNumber(n float64) *web.Rule {
	return web.NewRule(web.Phrase("must be greater than %d", n), validator.Min(n))
}

func MaxNumber(n float64) *web.Rule {
	return web.NewRule(web.Phrase("must be less than %d", n), validator.Max(n))
}
