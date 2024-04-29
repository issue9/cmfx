// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport

import "github.com/issue9/web"

var (
	errExists       = web.NewLocaleError("user already exists")
	errUnauthorized = web.NewLocaleError("unauthorized")
)

func ErrExists() error { return errExists }

func ErrUnauthorized() error { return errUnauthorized }
