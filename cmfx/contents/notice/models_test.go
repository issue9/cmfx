// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer = &noticePO{}
	_ orm.TableNamer = &groupPO{}
)
