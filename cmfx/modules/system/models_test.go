// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer    = &modelHealth{}
	_ orm.BeforeUpdater = &modelHealth{}
)
