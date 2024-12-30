// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"database/sql"
	"html"
	"time"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/types"
)

// 用户的基本信息
type infoPO struct {
	XMLName struct{} `orm:"-" yaml:"-" json:"-" cbor:"-" xml:"info"`

	// 关联的用户 ID
	ID int64 `orm:"name(id);unique(id)" json:"id" xml:"id,attr" cbor:"id" yaml:"id"`

	// 生日
	Birthday sql.NullTime `orm:"name(birthday);nullable" yaml:"birthday" json:"birthday" cbor:"birthday" xml:"birthday"`

	// 性别
	Sex types.Sex `orm:"name(sex)" json:"sex" xml:"sex,attr" cbor:"sex" yaml:"sex"`

	// 昵称
	Nickname string `orm:"name(nickname);len(50)" json:"nickname" xml:"nickname" cbor:"nickname" yaml:"nickname"`

	// 头像
	Avatar string `orm:"name(avatar);len(1000)" json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty"`

	// 邀请人的 ID
	Inviter int64 `orm:"name(inviter)" json:"inviter,omitempty" yaml:"inviter,omitempty" xml:"inviter,omitempty" cbor:"inviter,omitempty"`
}

func (*infoPO) TableName() string { return `_info` }

func (a *infoPO) BeforeInsert() error {
	a.Nickname = html.EscapeString(a.Nickname)
	return nil
}

// BeforeUpdate 更新之前需要执行的操作
func (a *infoPO) BeforeUpdate() error {
	a.Nickname = html.EscapeString(a.Nickname)
	return nil
}

type memberTO struct {
	m *Module

	XMLName struct{} `json:"-" cbor:"-" yaml:"-" xml:"member"`

	Username string    `json:"username" yaml:"username" xml:"username" cbor:"username" comment:"username"`
	Password string    `json:"password" yaml:"password" xml:"password" cbor:"password" comment:"password"`
	Inviter  string    `json:"inviter,omitempty" yaml:"inviter,omitempty" xml:"inviter,omitempty" cbor:"inviter,omitempty" comment:"inviter"`
	Birthday time.Time `json:"birthday,omitempty" yaml:"birthday,omitempty" cbor:"birthday,omitempty" xml:"birthday,omitempty" comment:"birthday"`
	Sex      types.Sex `json:"sex,omitempty" xml:"sex,attr,omitempty" cbor:"sex,omitempty" yaml:"sex,omitempty" comment:"sex"`
	Nickname string    `json:"nickname,omitempty" xml:"nickname,omitempty" cbor:"nickname,omitempty" yaml:"nickname,omitempty" comment:"nickname"`
	Avatar   string    `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty" comment:"avatar"`

	inviter int64
}

func (mem *memberTO) Filter(v *web.FilterContext) {
	birthday := filter.NewBuilder[time.Time](filter.V(validator.ZeroOr(func(t time.Time) bool {
		return t.After(time.Now())
	}), locales.InvalidValue))

	v.Add(filters.NotEmpty("username", &mem.Username)).
		Add(filters.NotEmpty("password", &mem.Password)).
		Add(birthday("birthday", &mem.Birthday)).
		Add(filter.NewBuilder(filter.V(validator.ZeroOr(types.SexValidator), locales.InvalidValue))("sex", &mem.Sex)).
		Add(filters.Avatar("avatar", &mem.Avatar)).
		Add(filter.NewBuilder(filter.V(func(no string) bool {
			u, err := mem.m.UserModule().GetUserByNO(no)
			if err != nil {
				return false
			}
			mem.inviter = u.ID
			return true
		}, locales.InvalidValue))("inviter", &mem.Inviter))
}
