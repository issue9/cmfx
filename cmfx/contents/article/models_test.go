// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer     = &articlePO{}
	_ orm.BeforeInserter = &articlePO{}
	_ orm.BeforeUpdater  = &articlePO{}
)
