// SPDX-License-Identifier: MIT

package securitylog

import (
	"errors"
	"html"
	"time"
)

type log struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`

	UID       int64  `orm:"name(uid);index(uid)"` // 关联的用户
	Content   string `orm:"name(content);len(-1)"`
	IP        string `orm:"name(ip);len(50)"`
	UserAgent string `orm:"name(user_agent);len(500)"`
}

func (l *log) TableName() string { return "_securitylogs" }

func (l *log) BeforeInsert() error {
	l.Created = time.Now()
	l.Content = html.EscapeString(l.Content)
	l.IP = html.EscapeString(l.IP)
	l.UserAgent = html.EscapeString(l.UserAgent)

	return nil
}

func (l *log) BeforeUpdate() error {
	return errors.New("此表不存在更新记录的情况")
}
