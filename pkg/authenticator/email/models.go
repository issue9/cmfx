// SPDX-License-Identifier: MIT

package email

import (
	"database/sql"
	"time"
)

// 如果涉及多次送，会替换之前发送的记录。
type modelEmail struct {
	ID       int64        `orm:"name(id);ai"`
	Created  time.Time    `orm:"name(created)"`
	Expired  time.Time    `orm:"name(expired)"`                      // 过期时间
	Verified sql.NullTime `orm:"name(verified);nullable"`            // 验证时间
	Email    string       `orm:"name(email);len(500);unique(email)"` // 接收者邮箱
	Code     string       `orm:"name(code);len(8)"`                  // 验证码
	Deleted  bool         `orm:"name(deleted)"`                      // 是否是主动删除的
	UID      int64        `orm:"name(uid);nullable;unique(uid)"`     // 关联的 UID，可以为空
}

func (l *modelEmail) TableName() string { return `_auth_emails` }

func (l *modelEmail) BeforeInsert() error {
	l.ID = 0
	l.Created = time.Now()
	return nil
}
