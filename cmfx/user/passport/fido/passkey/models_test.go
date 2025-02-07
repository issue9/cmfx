// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

import (
	"github.com/issue9/orm/v6"

	"github.com/go-webauthn/webauthn/webauthn"
)

var (
	_ orm.TableNamer = &accountPO{}
	_ webauthn.User  = &accountPO{}
)
