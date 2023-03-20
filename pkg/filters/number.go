// SPDX-License-Identifier: MIT

package filters

import (
	"github.com/issue9/filter/validator"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"
)

var (
	MinZero = MinNumber(0)
)

func MinNumber[T validator.Number](n T) filter.BuildFilterFuncOf[T] {
	return filter.New(filter.NewRule(validator.GreatEqual(n), web.Phrase("must be greater than %d", n)))
}

func MaxNumber[T validator.Number](n T) filter.BuildFilterFuncOf[T] {
	return filter.New(filter.NewRule(validator.LessEqual(n), web.Phrase("must be less than %d", n)))
}
