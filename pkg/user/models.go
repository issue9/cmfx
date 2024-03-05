// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"html"
	"time"
)

//go:generate web enum -i=./models.go -o=./state_methods.go -t=State
const (
	StateNormal  State = iota // 正常
	StateLocked               // 锁定
	StateDeleted              // 离职
)

type (
	// State 表示管理员的状态
	//
	// @enum normal locked deleted
	// @type string
	State int8

	User struct {
		XMLName struct{}  `orm:"-" json:"-" xml:"user"`
		ID      int64     `orm:"name(id);ai" json:"id" xml:"id,attr"`                 // 用户的自增 ID
		NO      string    `orm:"name(no);len(32);unique(no)" json:"no" xml:"no,attr"` // 用户的唯一编号，一般用于前端
		Created time.Time `orm:"name(created)" json:"created" xml:"created,attr"`     // 添加时间
		State   State     `orm:"name(state)" json:"state" xml:"state,attr"`           // 状态
	}

	log struct {
		ID      int64     `orm:"name(id);ai"`
		Created time.Time `orm:"name(created)"`

		UID       int64  `orm:"name(uid);index(uid)"` // 关联的用户
		Content   string `orm:"name(content);len(-1)"`
		IP        string `orm:"name(ip);len(50)"`
		UserAgent string `orm:"name(user_agent);len(500)"`
	}

	respLog struct {
		Content   string    `json:"content" xml:",cdata"`
		IP        string    `json:"ip" xml:"ip,attr"`
		UserAgent string    `json:"ua" xml:"ua"`
		Created   time.Time `xml:"created" json:"created"`
	}
)

func (*User) TableName() string { return `_users` }

func (a *User) BeforeInsert() error {
	a.ID = 0
	a.Created = time.Now()
	return nil
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
	panic("此表不存在更新记录的情况")
}
