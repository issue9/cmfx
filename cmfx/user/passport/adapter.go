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
	// uid 和 identity 分别表示验证成功之后，与之关联的用户 ID 以及在当前适配器中表示的唯一 ID。
	// 有可能存在 uid 为零而 identity 不会空的情况，比如由 [Adapter.Add] 添了一条 uid 为零的数据
	// 或是像 oauth 验证等也可能返回 uid 为零。一旦返回的 uid 为零，表示用户提交的数据没问题，
	// 但是找不到与外部用户关联的 uid，可通过 [Adapter.Add] 与具体的 uid 进行关联；
	//
	// 如果验证失败，将返回 [ErrUnauthorized] 错误。
	Valid(username, password string, t time.Time) (uid int64, identity string, err error)

	// Identity 获取 uid 关联的账号名
	//
	// 如果不存在，返回空值和 [ErrUIDNotExists]
	Identity(int64) (string, error)

	// Delete 解绑用户
	//
	// 如果 uid 为零值，清空所有的临时验证数据。
	Delete(uid int64) error

	// Change 改变用户的认证数据
	//
	// uid 为需要操作的用户，不能为零；
	// pass 一般为旧的认证代码，比如密码、验证码等；
	// n 为新的认证数据，由用户自定义，一般为新密码或是新的设备 ID 等；
	Change(uid int64, pass, n string) error

	// Set 强制修改用户 uid 的认证数据
	//
	// uid 为需要操作的用户，不能为零；
	// n 为新的认证数据，由用户自定义，一般为新密码或是新的设备 ID 等；
	Set(uid int64, n string) error

	// Add 关联用户数据
	//
	// uid 表示关联的用户 ID，如果为空值，表示添加一个临时的验证数据，
	// 之后在 [Adapter.Valid] 中验证不再返回错误，但是返回的 uid 为零；
	// identity 为用户在当前对象中的唯一标记；
	// code 为实现者的自定义行为，比如密码、设备的当前代码等。
	Add(uid int64, identity, code string, t time.Time) error
}
