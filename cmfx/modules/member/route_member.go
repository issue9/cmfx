// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"cmp"
	"database/sql"
	"slices"
	"time"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

type memberInfoVO struct {
	XMLName struct{} `xml:"info" json:"-" cbor:"-" yaml:"-"`

	NO       string     `json:"no" yaml:"no" cbor:"no" xml:"no,attr"`
	Created  time.Time  `json:"created" yaml:"created" cbor:"created" xml:"created"`
	State    user.State `json:"state" yaml:"state" cbor:"state" xml:"state"`
	Birthday time.Time  `json:"birthday,omitempty" cbor:"birthday,omitempty" xml:"birthday,omitempty" yaml:"birthday,omitempty"`
	Sex      types.Sex  `json:"sex" xml:"sex,attr" cbor:"sex" yaml:"sex"`
	Nickname string     `json:"nickname" xml:"nickname" cbor:"nickname" yaml:"nickname"`
	Avatar   string     `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty"`
	Level    int64      `json:"level,omitempty" yaml:"level,omitempty" xml:"level,attr,omitempty" cbor:"level,omitempty"`
	Type     int64      `json:"type,omitempty" yaml:"type,omitempty" xml:"type,attr,omitempty" cbor:"type,omitempty"`

	// 当前用户已经开通的验证方式
	Passports []*passportIdentityVO `json:"passports,omitempty" xml:"passports>passport,omitempty" cbor:"passports,omitempty" yaml:"passports,omitempty"`
}

func (m *Module) memberGetInfo(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	info := &infoPO{ID: u.ID}
	f, err := m.UserModule().Module().DB().Select(info)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !f {
		return ctx.NotFound()
	}

	ps := make([]*passportIdentityVO, 0)
	for k, v := range m.user.Identities(u.ID) {
		ps = append(ps, &passportIdentityVO{
			ID:       k,
			Identity: v,
		})
	}
	slices.SortFunc(ps, func(a, b *passportIdentityVO) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

	return web.OK(&memberInfoVO{
		NO:        u.NO,
		Created:   u.Created,
		State:     u.State,
		Birthday:  info.Birthday.Time,
		Sex:       info.Sex,
		Nickname:  info.Nickname,
		Avatar:    info.Avatar,
		Type:      info.Type,
		Level:     info.Level,
		Passports: ps,
	})
}

type memberInfoPathTO struct {
	m *Module

	XMLName  struct{}  `xml:"info" json:"-" cbor:"-" yaml:"-"`
	Birthday time.Time `json:"birthday,omitempty" cbor:"birthday,omitempty" xml:"birthday,omitempty" yaml:"birthday,omitempty"`
	Sex      types.Sex `json:"sex" xml:"sex,attr" cbor:"sex" yaml:"sex"`
	Nickname string    `json:"nickname" xml:"nickname" cbor:"nickname" yaml:"nickname"`
	Avatar   string    `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty"`
}

func (mem *memberInfoPathTO) Filter(v *web.FilterContext) {
	birthday := filter.NewBuilder(filter.V(validator.ZeroOr(func(t time.Time) bool {
		return t.After(time.Now())
	}), locales.InvalidValue))

	v.Add(birthday("birthday", &mem.Birthday)).
		Add(filter.NewBuilder(filter.V(validator.ZeroOr(types.SexValidator), locales.InvalidValue))("sex", &mem.Sex)).
		Add(filters.Avatar("avatar", &mem.Avatar))
}

func (m *Module) memberPatchInfo(ctx *web.Context) web.Responser {
	data := &memberInfoPathTO{m: m}
	if resp := ctx.Read(true, data, cmfx.NotFoundInvalidPath); resp != nil {
		return resp
	}

	u := m.UserModule().CurrentUser(ctx)
	info := &infoPO{
		ID:       u.ID,
		Birthday: sql.NullTime{Time: data.Birthday, Valid: !data.Birthday.IsZero()},
		Sex:      data.Sex,
		Nickname: data.Nickname,
		Avatar:   data.Avatar,
	}
	if _, _, err := m.user.Module().DB().Save(info, "birthday", "avatar"); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

type memberInfoTO struct {
	memberInfoPathTO
	Username  string `json:"username" yaml:"username" xml:"username" cbor:"username" comment:"username"`
	Password  string `json:"password" yaml:"password" xml:"password" cbor:"password" comment:"password"`
	Inviter   string `json:"inviter,omitempty" yaml:"inviter,omitempty" xml:"inviter,omitempty" cbor:"inviter,omitempty" comment:"inviter"`
	inviterID int64
}

func (mem *memberInfoTO) Filter(v *web.FilterContext) {
	mem.memberInfoPathTO.Filter(v)

	v.Add(filters.NotEmpty("username", &mem.Username)).
		Add(filters.NotEmpty("password", &mem.Password)).
		Add(filter.NewBuilder(filter.V(validator.ZeroOr(func(no string) bool {
			u, err := mem.m.UserModule().GetUserByNO(no)
			if err != nil {
				return false
			}
			mem.inviterID = u.ID
			return true
		}), locales.InvalidValue))("inviter", &mem.Inviter))
}

func (mem *memberInfoTO) toInfo() *RegisterInfo {
	return &RegisterInfo{
		Username: mem.Username,
		Password: mem.Password,
		Birthday: mem.Birthday,
		Sex:      mem.Sex,
		Nickname: mem.Nickname,
		Avatar:   mem.Avatar,
		Inviter:  mem.inviterID,
	}
}

func (m *Module) memberRegister(ctx *web.Context) web.Responser {
	data := &memberInfoTO{memberInfoPathTO: memberInfoPathTO{m: m}}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	msg := web.Phrase("register successful").LocaleString(ctx.LocalePrinter())
	_, err := m.Add(user.StateNormal, data.toInfo(), ctx.ClientIP(), ctx.Request().UserAgent(), msg)
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

func (m *Module) memberGetMemberInvited(ctx *web.Context) web.Responser {
	q := &invitedQuery{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	mems, err := m.Invited(m.UserModule().CurrentUser(ctx).ID, q)
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(mems)
}
