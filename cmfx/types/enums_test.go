// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package types

import (
	"github.com/issue9/orm/v6/core"
	"github.com/issue9/web/openapi"
)

var (
	_ core.PrimitiveTyper   = SexMale
	_ openapi.OpenAPISchema = SexFemale
)
