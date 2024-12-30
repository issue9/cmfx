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

	"github.com/issue9/cmfx/cmfx"
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
		Passports: ps,
	})
}

type memberInfoTO struct {
	XMLName  struct{}  `xml:"info" json:"-" cbor:"-" yaml:"-"`
	Birthday time.Time `json:"birthday,omitempty" cbor:"birthday,omitempty" xml:"birthday,omitempty" yaml:"birthday,omitempty"`
	Sex      types.Sex `json:"sex" xml:"sex,attr" cbor:"sex" yaml:"sex"`
	Nickname string    `json:"nickname" xml:"nickname" cbor:"nickname" yaml:"nickname"`
	Avatar   string    `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty"`
}

func (m *Module) memberPatchInfo(ctx *web.Context) web.Responser {
	data := &memberInfoTO{}
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

func (m *Module) memberRegister(ctx *web.Context) web.Responser {
	data := &MemberTO{m: m}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	msg := web.Phrase("register successful").LocaleString(ctx.LocalePrinter())
	_, err := m.NewMember(user.StateNormal, data, ctx.ClientIP(), ctx.Request().UserAgent(), msg)
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
