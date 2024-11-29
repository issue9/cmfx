// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"html"
	"time"

	"github.com/issue9/orm/v6/core"
)

//go:generate web enum -i=./models.go -t=State
const (
	StateNormal  State = iota // 正常
	StateLocked               // 锁定
	StateDeleted              // 删除
)

// State 表示管理员的状态
type State int8

func (s State) PrimitiveType() core.PrimitiveType { return core.String }

// 安全日志
type LogVO struct {
	Content   string    `json:"content" xml:",cdata" cbor:"content" yaml:"content" comment:"log content"`
	IP        string    `json:"ip" xml:"ip,attr" cbor:"ip" yaml:"ip" comment:"log IP"`
	UserAgent string    `json:"ua" xml:"ua" cbor:"ua" yaml:"ua" comment:"log user agent"`
	Created   time.Time `xml:"created" json:"created" cbor:"created" yaml:"created" comment:"created time"`
}

//--------------------------------------- user ---------------------------------------

type User struct {
	XMLName struct{}  `orm:"-" json:"-" xml:"user" cbor:"-"`
	Created time.Time `orm:"name(created)" json:"created" xml:"created,attr" cbor:"created" yaml:"created" comment:"created time"` // 添加时间
	State   State     `orm:"name(state)" json:"state" xml:"state,attr" cbor:"state" yaml:"state" comment:"user state"`             // 状态

	// 用户的自增 ID
	ID int64 `orm:"name(id);ai" json:"id" xml:"id,attr" cbor:"id" yaml:"id" comment:"user id"`
	// 用户编号，唯一且无序。
	NO string `orm:"name(no);len(32);unique(no)" json:"no" xml:"no" cbor:"no" yaml:"no" comment:"user no"`

	// 登录信息，username 不唯一，保证在标记为删除的情况下，不影响相同值的数据添加。
	Username string `orm:"name(username);len(32)" json:"username,omitempty" yaml:"username,omitempty" xml:"username,omitempty" cbor:"username,omitempty" comment:"username"`
	Password []byte `orm:"name(password);len(64)" json:"password,omitempty" yaml:"password,omitempty" xml:"password,omitempty" cbor:"password,omitempty" comment:"password"`
}

func (u *User) GetUID() string { return u.NO }

func (*User) TableName() string { return `_users` }

func (u *User) BeforeInsert() error {
	u.ID = 0
	u.Created = time.Now()
	return nil
}

//--------------------------------- modelLog ---------------------------------------------

type logPO struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`

	UID       int64  `orm:"name(uid);index(uid)"` // 关联的用户
	Content   string `orm:"name(content);len(-1)"`
	IP        string `orm:"name(ip);len(50)"`
	UserAgent string `orm:"name(user_agent);len(500)"`
}

func (l *logPO) TableName() string { return "_securitylogs" }

func (l *logPO) BeforeInsert() error {
	l.Created = time.Now()
	l.Content = html.EscapeString(l.Content)
	l.IP = html.EscapeString(l.IP)
	l.UserAgent = html.EscapeString(l.UserAgent)

	return nil
}

func (l *logPO) BeforeUpdate() error { panic("此表不存在更新记录的情况") }
