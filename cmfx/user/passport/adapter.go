// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport

import "time"

// Adapter 身份验证适配器
type Adapter interface {
	// Valid 验证账号
	//
	// username, password 向验证器提供的登录凭证，不同的实现对此两者的定义可能是不同的，
	// 比如 oauth2 中表示的是由 authURL 返回的 state 和 code 参数。
	//
	// uid 表示验证成功之后返回与 username 关联的用户 ID；
	// identity 表示在当前适配器中的唯一 ID 表示。部分适配器在 uid 为 0 时可能也返回一个非空的 identity，比如 ouath。
	// 用户可以将之与 uid 关联并注册；
	//
	// 如果验证失败，将返回 [ErrUnauthorized] 错误。
	Valid(username, password string, t time.Time) (uid int64, identity string, err error)

	// Identity 获取 uid 关联的账号名
	//
	// 如果不存在，返回空值和 [ErrUIDNotExists]
	Identity(int64) (string, error)

	// Delete 解绑用户
	Delete(uid int64) error

	// Change 改变用户的认证数据
	//
	// uid 为需要操作的用户；
	// pass 一般为旧的认证代码，比如密码、验证码等；
	// n 为新的认证数据，由用户自定义，一般为新密码或是新的设备 ID 等；
	Change(uid int64, pass, n string) error

	// Set 强制修改用户 uid 的认证数据
	//
	// n 的定义与 [Adapter.Change] 是相同的。
	Set(uid int64, n string) error

	// Add 关联用户数据
	//
	// identity 为用户在当前对象中的唯一标记；
	// code 为实现者的自定义行为，比如密码、设备的当前代码等。
	Add(uid int64, identity, code string, t time.Time) error
}
