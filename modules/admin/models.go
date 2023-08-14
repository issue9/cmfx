// SPDX-License-Identifier: MIT

package admin

import (
	"html"
	"net/url"
	"time"
)

//go:generate go run ../../cmd/enums -file=state_methods.go -pkg=admin -enum=State:s,StateNormal,StateLocked,StateLeft;Sex:s,Unknown,Male,Female

// State 表示管理员的状态
//
// @enum normal locked left
// @type string
type State int8

const (
	StateNormal State = iota // 正常
	StateLocked              // 锁定
	StateLeft                // 离职
)

// 性别
//
// @enum unknown male female
// @type string
type Sex int8

const (
	SexUnknown Sex = iota
	SexMale
	SexFemale
)

type modelAdmin struct {
	XMLName struct{} `orm:"-" json:"-" xml:"admin"`

	ID       int64     `orm:"name(id);ai" json:"id" xml:"id,attr"`
	Created  time.Time `orm:"name(created)" json:"created" xml:"created,attr"`
	State    State     `orm:"name(state)" json:"state" xml:"state,attr"`
	Sex      Sex       `orm:"name(sex)" json:"sex" xml:"sex,attr"`
	Name     string    `orm:"name(name);len(50)" json:"name,omitempty" xml:"name,omitempty"` // 真实名称
	Nickname string    `orm:"name(nickname);len(50)" json:"nickname" xml:"nickname"`
	Username string    `orm:"name(username);len(50)" json:"username" xml:"username"`
	Avatar   string    `orm:"name(avatar);len(1000)" json:"avatar,omitempty" xml:"avatar,attr,omitempty"`
	Super    bool      `orm:"name(super)" json:"super,omitempty" xml:"super,attr,omitempty"`
}

func (*modelAdmin) TableName() string { return `_admins` }

func (a *modelAdmin) BeforeInsert() error {
	a.ID = 0
	a.Created = time.Now()
	a.Name = html.EscapeString(a.Name)
	a.Nickname = html.EscapeString(a.Nickname)
	a.Avatar = url.QueryEscape(a.Avatar)

	return nil
}

// BeforeUpdate 更新之前需要执行的操作
func (a *modelAdmin) BeforeUpdate() error {
	a.Name = html.EscapeString(a.Name)
	a.Nickname = html.EscapeString(a.Nickname)
	a.Avatar = url.QueryEscape(a.Avatar)

	return nil
}
