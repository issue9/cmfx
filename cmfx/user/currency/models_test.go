// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"github.com/issue9/orm/v6"
	"github.com/issue9/web/openapi"
)

var (
	_ orm.TableNamer        = &overviewPO{}
	_ orm.TableNamer        = &LogPO{}
	_ orm.TableNamer        = &expirePO{}
	_ openapi.OpenAPISchema = TypeFreeze
)
