// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package totp

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
)

var (
	_ web.Filter     = &accountTO{}
	_ orm.TableNamer = &accountPO{}
)
