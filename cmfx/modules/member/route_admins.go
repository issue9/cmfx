// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"cmp"
	"net/http"
	"slices"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

type adminQueryMembers struct {
	query.Text
	States []user.State `query:"state,normal" comment:"state"`
	Sexes  []types.Sex  `query:"sex" comment:"sex"`
}

func (q *adminQueryMembers) Filter(v *web.FilterContext) {
	q.Text.Filter(v)
	v.Add(user.StateSliceFilter("state", &q.States)).
		Add(types.SexSliceFilter("sex", &q.Sexes))
}

type adminInfoVO struct {
	XMLName struct{} `xml:"info" json:"-" cbor:"-" yaml:"-"`

	ID       int64      `json:"id" yaml:"id" cbor:"id" xml:"id,attr"`
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

func (m *Module) adminGetMembers(ctx *web.Context) web.Responser {
	q := &adminQueryMembers{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.UserModule().Module().DB().SQLBuilder().Select().Column("info.*").From(orm.TableName(&infoPO{}), "info")

	if len(q.States) > 0 {
		m.user.LeftJoin(sql, "user", "{user}.{id}={info}.{id}", q.States)
	}

	if len(q.Sexes) > 0 {
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, g := range q.Sexes {
				ws.Or("info.{sex}=?", g)
			}
		})
	}
	if len(q.Text.Text) > 0 {
		text := "%" + q.Text.Text + "%"
		sql.And("(info.nickname LIKE ?)", text)
	}

	type modelInfo struct {
		infoPO
		NO      string     `orm:"name(no);len(32);unique(no)"` // 用户的唯一编号，一般用于前端
		Created time.Time  `orm:"name(created)"`               // 添加时间
		State   user.State `orm:"name(state)"`                 // 状态
	}

	return query.PagingResponserWithConvert(ctx, &q.Limit, sql, func(i *modelInfo) *adminInfoVO {
		return &adminInfoVO{
			ID:       i.ID,
			NO:       i.NO,
			Created:  i.Created,
			State:    i.State,
			Birthday: i.Birthday.Time,
			Sex:      i.Sex,
			Nickname: i.Nickname,
			Avatar:   i.Avatar,
		}
	})
}

type passportIdentityVO struct {
	ID       string `json:"id" xml:"id" cbor:"id" yaml:"id"`
	Identity string `json:"identity" xml:"identity" cbor:"identity" yaml:"id"`
}

func (m *Module) adminGetMember(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	a := &infoPO{ID: id}
	found, err := m.UserModule().Module().DB().Select(a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	ps := make([]*passportIdentityVO, 0)
	for k, v := range m.user.Identities(id) {
		ps = append(ps, &passportIdentityVO{
			ID:       k,
			Identity: v,
		})
	}
	slices.SortFunc(ps, func(a, b *passportIdentityVO) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

	return web.OK(&adminInfoVO{
		ID:        u.ID,
		NO:        u.NO,
		Created:   u.Created,
		State:     u.State,
		Birthday:  a.Birthday.Time,
		Sex:       a.Sex,
		Nickname:  a.Nickname,
		Avatar:    a.Avatar,
		Passports: ps,
	})
}

func (m *Module) adminPostMemberLock(ctx *web.Context) web.Responser {
	return m.setMemberState(ctx, user.StateLocked, http.StatusCreated)
}

func (m *Module) adminDeleteMember(ctx *web.Context) web.Responser {
	return m.setMemberState(ctx, user.StateDeleted, http.StatusNoContent)
}

func (m *Module) adminDeleteMemberLock(ctx *web.Context) web.Responser {
	return m.setMemberState(ctx, user.StateNormal, http.StatusNoContent)
}

func (m *Module) setMemberState(ctx *web.Context, state user.State, code int) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	if u.State == user.StateDeleted && state != user.StateDeleted {
		return ctx.Problem(cmfx.ForbiddenStateNotAllow)
	}

	if err := m.user.SetState(nil, u, state); err != nil {
		return ctx.Error(err, "")
	}

	return web.Status(code)
}
