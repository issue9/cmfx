// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer    = &snapshotPO{}
	_ orm.BeforeUpdater = &snapshotPO{}

	_ orm.TableNamer     = &commentPO{}
	_ orm.BeforeInserter = &commentPO{}
	_ orm.BeforeUpdater  = &commentPO{}
)
