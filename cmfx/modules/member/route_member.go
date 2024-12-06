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
	"github.com/issue9/cmfx/cmfx/filters"
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

func (m *Module) memberPathInfo(ctx *web.Context) web.Responser {
	data := &memberInfoTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidPath); resp != nil {
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
	if _, err := m.user.Module().DB().Update(info, "birthday", "avatar"); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

type memberTO struct {
	XMLName  struct{} `json:"-" cbor:"-" yaml:"-" xml:"member"`
	Username string   `json:"username" yaml:"username" xml:"username" cbor:"username"`
	Password string   `json:"password" yaml:"password" xml:"password" cbor:"password"`
}

func (q *memberTO) Filter(v *web.FilterContext) {
	v.Add(filters.NotEmpty("username", &q.Username)).
		Add(filters.NotEmpty("password", &q.Password))
}

func (m *Module) memberRegister(ctx *web.Context) web.Responser {
	data := &memberTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if _, err := m.user.New(user.StateNormal, data.Username, data.Password); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}
