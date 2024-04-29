// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package types

import "github.com/issue9/orm/v6/types"

type (
	Int64s  = types.SliceOf[int64]
	Strings = types.SliceOf[string]
)
