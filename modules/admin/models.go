// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"html"
	"net/url"

	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/pkg/filters"
	"github.com/issue9/cmfx/pkg/user"
)

// 用户的基本信息
type modelInfo struct {
	ID       int64    `orm:"name(id);unique(id)"`
	Sex      cmfx.Sex `orm:"name(sex)"`
	Name     string   `orm:"name(name);len(50)"`     // 真实名称，展示于后台
	Nickname string   `orm:"name(nickname);len(50)"` // 昵称，前台需要展示的地方显示此值
	Avatar   string   `orm:"name(avatar);len(1000)"`
}

type respInfo struct {
	m *Admin

	XMLName struct{} `xml:"info" json:"-"`

	ID       int64    `json:"id" xml:"id,attr"`
	Sex      cmfx.Sex `json:"sex" xml:"sex,attr"`
	Name     string   `json:"name" xml:"name"`         // 真实名称，展示于后台
	Nickname string   `json:"nickname" xml:"nickname"` // 昵称，前台需要展示的地方显示此值
	Avatar   string   `json:"avatar,omitempty" xml:"avatar,omitempty"`
}

type respInfoWithRoleState struct {
	respInfo
	Roles []int64    `json:"roles" xml:"roles>role"`
	State user.State `json:"state" xml:"state,attr"`
}

type respInfoWithAccount struct {
	respInfoWithRoleState
	Username string `json:"username" xml:"username"`
	Password string `json:"password" xml:"password"`
}

func (i *respInfo) Filter(v *web.FilterContext) {
	v.Add(filters.Avatar("avatar", &i.Avatar)).
		Add(cmfx.SexFilter("sex", &i.Sex))
}

func (i *respInfoWithRoleState) Filter(v *web.FilterContext) {
	i.respInfo.Filter(v)
	v.Add(web.NewFilter(web.NewSliceRule[int64, []int64](i.m.rbac.RoleExists, locales.InvalidValue))("roles", &i.Roles)).
		Add(user.StateFilter("state", &i.State))
}

func (i *respInfoWithAccount) Filter(v *web.FilterContext) {
	i.respInfo.Filter(v)
	v.Add(filters.RequiredString("username", &i.Username)).
		Add(filters.RequiredString("password", &i.Password))
}

func (*modelInfo) TableName() string { return `_info` }

func (a *modelInfo) BeforeInsert() error {
	a.Name = html.EscapeString(a.Name)
	a.Nickname = html.EscapeString(a.Nickname)
	a.Avatar = url.QueryEscape(a.Avatar)

	return nil
}

// BeforeUpdate 更新之前需要执行的操作
func (a *modelInfo) BeforeUpdate() error {
	a.Name = html.EscapeString(a.Name)
	a.Nickname = html.EscapeString(a.Nickname)
	a.Avatar = url.QueryEscape(a.Avatar)

	return nil
}
