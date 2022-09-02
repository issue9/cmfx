// SPDX-License-Identifier: MIT

package securitylog

import "github.com/issue9/orm/v5"

var (
	_ orm.TableNamer     = &log{}
	_ orm.BeforeUpdater  = &log{}
	_ orm.BeforeInserter = &log{}
)
