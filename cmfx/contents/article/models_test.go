// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer     = &snapshotPO{}
	_ orm.BeforeInserter = &snapshotPO{}
	_ orm.BeforeUpdater  = &snapshotPO{}

	_ orm.TableNamer = &articlePO{}
)
