// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package oauth

import "github.com/issue9/cmfx/pkg/authenticator"

var _ authenticator.Authenticator = &OAuth[*info]{}

type info struct {
	identity string
}

func (i *info) Identity() string { return i.identity }
