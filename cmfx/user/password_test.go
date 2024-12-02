// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"
)

var (
	_ Passport   = &password{}
	_ web.Filter = &passwordTO{}
	_ web.Filter = &accountTO{}
)

func TestUsernameValidator(t *testing.T) {
	a := assert.New(t, false)
	a.True(UsernameValidator("a123")).
		True(UsernameValidator("_123")).
		True(UsernameValidator("_1-23")).
		False(UsernameValidator("1-23")).
		False(UsernameValidator(""))
}
