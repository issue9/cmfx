// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"database/sql"
	"time"
)

// 验证码的管理
//
// 一个用户一条记录，有新记录就执行覆盖操作，
// 如果需要所有的验证码发送记录，需要使用者自己实现，比如短信发送记录，邮件的发送记录等。
type modelCode struct {
	// NOTE: 如果执行了删除操作，则物理删除记录。

	ID       int64        `orm:"name(id);ai"`
	Created  time.Time    `orm:"name(created)"`
	Expired  time.Time    `orm:"name(expired)"`                            // 过期时间
	Verified sql.NullTime `orm:"name(verified);nullable"`                  // 验证时间
	Identity string       `orm:"name(identity);len(500);unique(identity)"` // 接收者，手机号、邮箱等。
	Code     string       `orm:"name(code);len(8)"`                        // 验证码
	UID      int64        `orm:"name(uid);default(0)"`                     // 关联的 UID，可以为空
}

func (l *modelCode) TableName() string { return `` }
