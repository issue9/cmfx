// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package currency

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer = &overviewPO{}
	_ orm.TableNamer = &LogPO{}
	_ orm.TableNamer = &expirePO{}
)
