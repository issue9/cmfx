// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package email

import "github.com/issue9/cmfx/pkg/authenticator"

var _ authenticator.Authenticator = &Email{}
