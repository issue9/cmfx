// SPDX-License-Identifier: MIT

package cmfx

//go:generate go run ./cmd/enums -file=types_methods.go -pkg=cmfx -enum=Sex:s,Unknown,Male,Female

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
