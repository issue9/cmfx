// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import "github.com/issue9/web"

var errBalanceNotEnough = web.NewLocaleError("balance not enough")

// ErrBalanceNotEnough 余额不足
func ErrBalanceNotEnough() error { return errBalanceNotEnough }
