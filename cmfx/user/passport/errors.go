// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport

import "github.com/issue9/web"

var (
	errIdentityExists    = web.NewLocaleError("identity already exists")
	errUIDExists         = web.NewLocaleError("uid already exists")
	errIdentityNotExists = web.NewLocaleError("identity not exists")
	errUIDNotExists      = web.NewLocaleError("uid not exists")
	errUnauthorized      = web.NewLocaleError("unauthorized")
	errInvalidIdentity   = web.NewLocaleError("invalid indetity format")
)

func ErrUIDMustBeGreatThanZero() error { return web.NewLocaleError("uid must be great than 0") }

func ErrIdentityExists() error { return errIdentityExists }

func ErrUIDExists() error { return errUIDExists }

func ErrIdentityNotExists() error { return errIdentityNotExists }

func ErrUIDNotExists() error { return errUIDNotExists }

// ErrInvalidIdentity Identity 的格式错误
func ErrInvalidIdentity() error { return errInvalidIdentity }

func ErrUnauthorized() error { return errUnauthorized }
