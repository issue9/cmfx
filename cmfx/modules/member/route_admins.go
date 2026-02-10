// SPDX-FileCopyrightText: 2024-2026 caixw
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
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

type adminQueryMembers struct {
	m *Module

	query.Text
	States []user.State `query:"state,normal" comment:"state"`
	Sexes  []types.Sex  `query:"sex" comment:"sex"`
	Levels []int64      `query:"level"`
	Types  []int64      `query:"type"`
}

func (q *adminQueryMembers) Filter(v *web.FilterContext) {
	q.Text.Filter(v)
	v.Add(user.StateSliceFilter("state", &q.States)).
		Add(types.SexSliceFilter("sex", &q.Sexes)).
		Add(filter.NewBuilder(filter.SV[[]int64](q.m.levels.Valid, locales.InvalidValue))("level", &q.Levels)).
		Add(filter.NewBuilder(filter.SV[[]int64](q.m.types.Valid, locales.InvalidValue))("type", &q.Types))
}

type adminInfoVO struct {
	ID       int64      `json:"id" yaml:"id" cbor:"id"`
	NO       string     `json:"no" yaml:"no" cbor:"no"`
	Created  time.Time  `json:"created" yaml:"created" cbor:"created"`
	State    user.State `json:"state" yaml:"state" cbor:"state"`
	Birthday time.Time  `json:"birthday,omitzero" cbor:"birthday,omitzero" yaml:"birthday,omitempty"`
	Sex      types.Sex  `json:"sex" cbor:"sex" yaml:"sex"`
	Nickname string     `json:"nickname" cbor:"nickname" yaml:"nickname"`
	Avatar   string     `json:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty"`
	Level    int64      `json:"level,omitempty" yaml:"level,omitempty" cbor:"level,omitempty"`
	Type     int64      `json:"type,omitempty" yaml:"type,omitempty" cbor:"type,omitempty"`

	// 当前用户已经开通的验证方式
	Passports []*user.IdentityVO `json:"passports,omitempty" cbor:"passports,omitempty" yaml:"passports,omitempty"`
}

func (m *Module) adminGetMembers(ctx *web.Context) web.Responser {
	q := &adminQueryMembers{m: m}
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
	if len(q.Levels) > 0 {
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, l := range q.Levels {
				ws.Or("info.{level}=?", l)
			}
		})
	}
	if len(q.Types) > 0 {
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, t := range q.Types {
				ws.Or("info.{type}=?", t)
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
			Level:    i.Level,
			Type:     i.Type,
		}
	})
}

func (m *Module) adminGetMemberInvited(ctx *web.Context) web.Responser {
	uid, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	q := &invitedQuery{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	mems, err := m.Invited(uid, q)
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(mems)
}

func (m *Module) adminGetMember(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
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

	ps := slices.Collect(m.user.Identities(id))
	slices.SortFunc(ps, func(a, b *user.IdentityVO) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

	return web.OK(&adminInfoVO{
		ID:        u.ID,
		NO:        u.NO,
		Created:   u.Created,
		State:     u.State,
		Birthday:  a.Birthday.Time,
		Sex:       a.Sex,
		Nickname:  a.Nickname,
		Avatar:    a.Avatar,
		Level:     a.Level,
		Type:      a.Type,
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
	id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	if u.State == user.StateDeleted && state != user.StateDeleted {
		return ctx.Problem(cmfx.ConflictStateNotAllow)
	}

	if err := m.user.SetState(nil, u, state); err != nil {
		return ctx.Error(err, "")
	}

	return web.Status(code)
}

func (m *Module) adminPutLevel(ctx *web.Context) web.Responser {
	return m.levels.HandlePutTag(ctx, "id")
}

func (m *Module) adminPutType(ctx *web.Context) web.Responser {
	return m.types.HandlePutTag(ctx, "id")
}

func (m *Module) adminGetStatcstic(ctx *web.Context) web.Responser {
	s, err := m.user.Statistic(ctx.Begin())
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(s)
}

type adminMemberTypeTO struct {
	m    *Module
	Type int64 `json:"type" cbor:"type" yaml:"type"`
}

func (m *adminMemberTypeTO) Filter(ctx *web.FilterContext) {
	ctx.Add(m.m.types.Filter()("type", &m.Type))
}

func (m *Module) adminPutMemberType(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	if _, err := m.user.GetUser(id); err != nil {
		return ctx.Error(err, "")
	}

	data := &adminMemberTypeTO{m: m}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if _, err := m.UserModule().Module().DB().Update(&infoPO{ID: id, Type: data.Type}, "type"); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

type adminMemberLevelTO struct {
	m     *Module
	Level int64 `json:"level" cbor:"level" yaml:"level"`
}

func (m *adminMemberLevelTO) Filter(ctx *web.FilterContext) {
	ctx.Add(m.m.types.Filter()("type", &m.Level))
}

func (m *Module) adminPutMemberLevel(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	if _, err := m.user.GetUser(id); err != nil {
		return ctx.Error(err, "")
	}

	data := &adminMemberLevelTO{m: m}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if _, err := m.UserModule().Module().DB().Update(&infoPO{ID: id, Level: data.Level}, "level"); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}
