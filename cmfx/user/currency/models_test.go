// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer = &overviewPO{}
	_ orm.TableNamer = &logPO{}
	_ orm.TableNamer = &expirePO{}
)
