// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"testing"
	"unicode"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestGenerator(t *testing.T) {
	a := assert.New(t, false)

	suite := test.NewSuite(a)
	defer suite.Close()

	s := suite.Module().Server()

	f := NumberGenerator(s, "g1", 5)
	a.NotNil(f)
	code := f()
	a.Length(code, 5).True(func() bool {
		for _, r := range code {
			if !unicode.IsDigit(r) {
				return false
			}
		}
		return true
	}())

	f = AlphaNumberGenerator(s, "g1", 6)
	a.NotNil(f)
	a.Length(f(), 6)
}
