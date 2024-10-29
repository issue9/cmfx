// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport

import (
	"time"

	"github.com/issue9/web"
)

// Adapter 身份验证的适配器
type Adapter interface {
	// ID 该适配器对象的唯一标记
	ID() string

	// Description 对当前实例的描述信息
	Description() web.LocaleStringer

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

	// UID 获取与 identity 关联的 uid
	//
	// 如果不存在，返回空值和 [ErrIdentityNotExists]
	//
	// 如果返回 0，且不带错误信息，可能是临时验证的数据。
	UID(identity string) (int64, error)

	// Delete 解绑用户
	//
	// 如果 uid 为零值，清空所有的临时验证数据。
	Delete(uid int64) error

	// Update 更新用户的验证数据
	//
	// 部分实现可能不会实现该方法，比如基于固定时间算法的验证(TOTP)，
	// 或是以密码形式进行验证的接口。
	Update(uid int64) error

	// Add 关联用户数据
	//
	// uid 表示关联的用户 ID，如果为空值，表示添加一个临时的验证数据，
	// 之后在 [Adapter.Valid] 中验证不再返回错误，但是返回的 uid 为零；
	// identity 为用户在当前对象中的唯一标记；
	// code 为实现者的自定义行为，比如密码、设备的当前代码等。
	Add(uid int64, identity, code string, t time.Time) error
}
