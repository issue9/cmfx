// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport

// Adapter 身份验证接口
type Adapter interface {
	// Valid 验证账号
	//
	// username, password 向验证器提供的登录凭证，不同的实现对此两者的定义可能是不同的，
	// 比如 oauth2 中表示的是由 authURL 返回的 state 和 code 参数。
	// ok 表示是否验证成功；
	// uid 表示验证成功之后返回与 username 关联的用户 ID；
	// identity 表示验证成功，但是并未与任何 uid 绑定时，则返回该验证器验证之后的用户标记，仅当 uid 为 0 时此值才有效；
	Valid(username, password string) (uid int64, identity string, ok bool)

	// Identity 获取 uid 关联的账号名
	Identity(int64) (string, bool)
}
