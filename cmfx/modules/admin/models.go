// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"html"
	"net/url"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/rbac"
	"github.com/issue9/cmfx/locales"
)

// 管理员的基本信息
type info struct {
	m *Module

	XMLName struct{} `orm:"-" xml:"info" json:"-" cbor:"-"`

	ID int64 `orm:"name(id);unique(id)" json:"id" xml:"id,attr" cbor:"id"`

	// 性别
	Sex types.Sex `orm:"name(sex)" json:"sex" xml:"sex,attr" cbor:"sex"`

	// 真实名称
	Name string `orm:"name(name);len(50)" json:"name" xml:"name" cbor:"name"`

	// 昵称
	Nickname string `orm:"name(nickname);len(50)" json:"nickname" xml:"nickname" cbor:"nickname"`

	// 界面语言
	//
	// 不会直接影响服务的处理，客户端自行决定是否采用。服务采用客户端的 Accept-Language 决定使用哪种语言。
	Language string `orm:"name(language);len(50)" json:"language" xml:"language" cbor:"language"`

	// 时区
	//
	// 不会直接影响服务的处理，客户端自行决定是否采用。
	Timezone string `orm:"name(timezone);len(50)" json:"timezone" xml:"timezone" cbor:"timezone"`

	// 头像
	Avatar string `orm:"name(avatar);len(1000)" json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty"`
}

// 包含权限的管理员信息
type ctxInfoWithRoleState struct {
	info
	Roles []string `json:"roles" xml:"roles>role" cbor:"roles"` // 关联的角色
	roles []*rbac.Role
	State user.State `json:"state" xml:"state,attr" cbor:"state"` // 用户状态
}

type reqInfoWithAccount struct {
	ctxInfoWithRoleState
	Username string `json:"username" xml:"username" cbor:"username"`
	Password string `json:"password" xml:"password" cbor:"password"`
}

func (i *info) Filter(v *web.FilterContext) {
	v.Add(filters.Avatar("avatar", &i.Avatar)).
		Add(types.SexFilter("sex", &i.Sex)).
		Add(filter.New("timezone", &i.Timezone, validator.V(validator.Timezone, locales.InvalidFormat))).
		Add(filter.New("language", &i.Language, validator.V(validator.LanguageTag, locales.InvalidFormat)))
}

func (i *ctxInfoWithRoleState) Filter(v *web.FilterContext) {
	i.roles = make([]*rbac.Role, 0, len(i.Roles))

	roleValidator := func(id string) bool {
		r := i.m.roleGroup.Role(id)
		if r == nil {
			return false
		}
		i.roles = append(i.roles, r)
		return !r.IsDescendant(id)
	}

	i.info.Filter(v)
	v.Add(filter.NewBuilder(filter.SV[[]string](roleValidator, locales.InvalidValue))("roles", &i.Roles)).
		Add(user.StateFilter("state", &i.State))
}

func (i *reqInfoWithAccount) Filter(v *web.FilterContext) {
	i.info.Filter(v)
	v.Add(filters.NotEmpty("username", &i.Username)).
		Add(filters.NotEmpty("password", &i.Password))
}

func (*info) TableName() string { return `_info` }

func (a *info) BeforeInsert() error {
	a.Name = html.EscapeString(a.Name)
	a.Nickname = html.EscapeString(a.Nickname)
	a.Avatar = url.QueryEscape(a.Avatar)

	return nil
}

// BeforeUpdate 更新之前需要执行的操作
func (a *info) BeforeUpdate() error {
	a.Name = html.EscapeString(a.Name)
	a.Nickname = html.EscapeString(a.Nickname)
	a.Avatar = url.QueryEscape(a.Avatar)

	return nil
}
