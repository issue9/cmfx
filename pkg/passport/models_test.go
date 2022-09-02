// SPDX-License-Identifier: MIT

package passport

import "github.com/issue9/orm/v5"

var (
	_ orm.TableNamer     = &code{}
	_ orm.BeforeInserter = &code{}
	_ orm.BeforeUpdater  = &code{}

	_ orm.TableNamer     = &password{}
	_ orm.BeforeInserter = &password{}
	_ orm.BeforeUpdater  = &password{}

	_ orm.TableNamer = &oauth{}
)
