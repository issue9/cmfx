// SPDX-License-Identifier: MIT

package enum

//go:generate go run ./make_state.go

// State 测试用
type State int8

// State 的枚举值
const (
	StateS1 State = iota + 0
	StateS2
)
