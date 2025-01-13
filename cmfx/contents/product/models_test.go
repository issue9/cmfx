// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package product

import "github.com/issue9/orm/v6"

var (
	_ orm.TableNamer = &snapshotPO{}
	_ orm.TableNamer = &productPO{}
	_ orm.TableNamer = &skuPO{}
)
