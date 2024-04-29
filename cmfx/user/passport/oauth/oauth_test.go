// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package oauth

import "github.com/issue9/cmfx/cmfx/user/passport"

var _ passport.Adapter = &OAuth[*info]{}

type info struct {
	identity string
}

func (i *info) Identity() string { return i.identity }
