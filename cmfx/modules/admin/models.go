// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"html"
	"time"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

// 管理员的基本信息
type info struct {
	m *Module

	XMLName struct{} `orm:"-" xml:"info" json:"-" cbor:"-" yaml:"-"`

	ID int64 `orm:"name(id);unique(id)" json:"id" xml:"id,attr" cbor:"id" yaml:"id"`

	// 性别
	Sex types.Sex `orm:"name(sex)" json:"sex" xml:"sex,attr" cbor:"sex" yaml:"sex" comment:"sex"`

	// 真实名称
	Name string `orm:"name(name);len(50)" json:"name" xml:"name" cbor:"name" yaml:"name"`

	// 昵称
	Nickname string `orm:"name(nickname);len(50)" json:"nickname" xml:"nickname" cbor:"nickname" yaml:"nickname" comment:"nickname"`

	// 头像
	Avatar string `orm:"name(avatar);len(1000)" json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty" comment:"avatar"`
}

// 包含权限的管理员信息
type infoWithRoleStateVO struct {
	info
	Roles   []string `json:"roles" xml:"roles>role" cbor:"roles" yaml:"roles"` // 关联的角色
	roles   []*rbac.Role
	State   user.State `json:"state" xml:"state,attr" cbor:"state" yaml:"state"`         // 用户状态
	NO      string     `json:"no" xml:"no,attr" cbor:"no" yaml:"no"`                     // 用户的唯一编号，一般用于前端
	Created time.Time  `json:"created" xml:"created,attr" cbor:"created" yaml:"created"` // 添加时间
}

// 添加新的管理员时，需要提供的数据
type infoWithAccountTO struct {
	infoWithRoleStateVO
	Username string `json:"username" xml:"username" cbor:"username" yaml:"username" comment:"username"` // 账号
	Password string `json:"password" xml:"password" cbor:"password" yaml:"password" comment:"password"` // 密码
}

func (i *info) Filter(v *web.FilterContext) {
	v.Add(filters.Avatar("avatar", &i.Avatar)).
		Add(types.SexFilter("sex", &i.Sex))
}

func (i *infoWithRoleStateVO) Filter(v *web.FilterContext) {
	roleValidator := func(id string) bool {
		r := i.m.roleGroup.Role(id)
		if r == nil {
			return false
		}
		return !r.IsDescendant(id)
	}

	i.info.Filter(v)
	v.Add(filter.NewBuilder(filter.SV[[]string](roleValidator, locales.InvalidValue))("roles", &i.Roles)).
		Add(user.StateFilter("state", &i.State))

	i.roles = make([]*rbac.Role, 0, len(i.Roles))
	for _, id := range i.Roles {
		i.roles = append(i.roles, i.m.roleGroup.Role(id))
	}
}

func (i *infoWithAccountTO) Filter(v *web.FilterContext) {
	i.infoWithRoleStateVO.Filter(v)
	v.Add(filters.NotEmpty("username", &i.Username)).
		Add(filters.NotEmpty("password", &i.Password))
}

func (*info) TableName() string { return `_info` }

func (i *info) BeforeInsert() error {
	i.Name = html.EscapeString(i.Name)
	i.Nickname = html.EscapeString(i.Nickname)

	return nil
}

// BeforeUpdate 更新之前需要执行的操作
func (i *info) BeforeUpdate() error {
	i.Name = html.EscapeString(i.Name)
	i.Nickname = html.EscapeString(i.Nickname)

	return nil
}
