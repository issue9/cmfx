// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"github.com/issue9/orm/v6/core"
	"github.com/issue9/web/openapi"
)

var (
	_ core.PrimitiveTyper   = StateNormal
	_ openapi.OpenAPISchema = StateDeleted
)
