// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
)

var (
	_ orm.TableNamer     = &accountPO{}
	_ orm.BeforeInserter = &accountPO{}
	_ web.Filter         = &accountTO{}
	_ web.Filter         = &TargetTO{}
)
