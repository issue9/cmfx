// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package types

import "github.com/issue9/orm/v6/core"

//go:generate web enum -i=./enums.go -o=./enums_methods.go -t=Sex

// 性别
//
// @enum unknown male female
// @type string
type Sex int8

const (
	SexUnknown Sex = iota
	SexMale
	SexFemale
)

func (s Sex) PrimitiveType() core.PrimitiveType { return core.String }
