// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"html"
	"net/url"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/rbac"
	"github.com/issue9/cmfx/locales"
)

// 用户的基本信息
type modelInfo struct {
	ID       int64     `orm:"name(id);unique(id)"`
	Sex      types.Sex `orm:"name(sex)"`
	Name     string    `orm:"name(name);len(50)"`     // 真实名称，展示于后台
	Nickname string    `orm:"name(nickname);len(50)"` // 昵称，前台需要展示的地方显示此值
	Avatar   string    `orm:"name(avatar);len(1000)"`
}

type respInfo struct {
	m *Loader

	XMLName struct{} `xml:"info" json:"-"`

	ID       int64     `json:"id" xml:"id,attr" cbor:"id"`
	Sex      types.Sex `json:"sex" xml:"sex,attr" cbor:"sex"`
	Name     string    `json:"name" xml:"name" cbor:"name"`             // 真实名称，展示于后台
	Nickname string    `json:"nickname" xml:"nickname" cbor:"nickname"` // 昵称，前台需要展示的地方显示此值
	Avatar   string    `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty"`
}

type respInfoWithRoleState struct {
	respInfo
	Roles []string `json:"roles" xml:"roles>role" cbor:"roles"`
	roles []*rbac.Role
	State user.State `json:"state" xml:"state,attr" cbor:"state"`
}

type respInfoWithAccount struct {
	respInfoWithRoleState
	Username string `json:"username" xml:"username" cbor:"username"`
	Password string `json:"password" xml:"password" cbor:"password"`
}

func (i *respInfo) Filter(v *web.FilterContext) {
	v.Add(filters.Avatar("avatar", &i.Avatar)).
		Add(types.SexFilter("sex", &i.Sex))
}

func (i *respInfoWithRoleState) Filter(v *web.FilterContext) {
	i.roles = make([]*rbac.Role, 0, len(i.Roles))

	roleValidator := func(id string) bool {
		r := i.m.roleGroup.Role(id)
		if r == nil {
			return false
		}
		i.roles = append(i.roles, r)
		return !r.IsDescendant(id)
	}

	i.respInfo.Filter(v)
	v.Add(filter.NewBuilder(filter.SV[[]string](roleValidator, locales.InvalidValue))("roles", &i.Roles)).
		Add(user.StateFilter("state", &i.State))
}

func (i *respInfoWithAccount) Filter(v *web.FilterContext) {
	i.respInfo.Filter(v)
	v.Add(filters.NotEmpty("username", &i.Username)).
		Add(filters.NotEmpty("password", &i.Password))
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
