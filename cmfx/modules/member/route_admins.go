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
	"github.com/issue9/web/filter"
	"github.com/issue9/webfilter/validator"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
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
		Add(filter.NewBuilder(filter.SV[[]int64](q.m.levels.Validator, locales.InvalidValue))("level", &q.Levels)).
		Add(filter.NewBuilder(filter.SV[[]int64](q.m.types.Validator, locales.InvalidValue))("type", &q.Types))
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
	Level    int64      `json:"level,omitempty" yaml:"level,omitempty" xml:"level,attr,omitempty" cbor:"level,omitempty"`
	Type     int64      `json:"type,omitempty" yaml:"type,omitempty" xml:"type,attr,omitempty" cbor:"type,omitempty"`

	// 当前用户已经开通的验证方式
	Passports []*passportIdentityVO `json:"passports,omitempty" xml:"passports>passport,omitempty" cbor:"passports,omitempty" yaml:"passports,omitempty"`
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

type passportIdentityVO struct {
	ID       string `json:"id" xml:"id" cbor:"id" yaml:"id"`
	Identity string `json:"identity" xml:"identity" cbor:"identity" yaml:"id"`
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
		Level:     a.Level,
		Type:      a.Type,
		Passports: ps,
	})
}

// 后台添加用户时需要的数据
type adminInfoTO struct {
	m *Module

	XMLName struct{} `json:"-" cbor:"-" yaml:"-" xml:"member"`

	State    user.State `json:"state,omitempty" yaml:"state,omitempty" xml:"state,attr,omitempty" cbor:"state,omitempty" comment:"state"`
	Username string     `json:"username" yaml:"username" xml:"username" cbor:"username" comment:"username"`
	Password string     `json:"password" yaml:"password" xml:"password" cbor:"password" comment:"password"`
	Birthday time.Time  `json:"birthday,omitempty" yaml:"birthday,omitempty" cbor:"birthday,omitempty" xml:"birthday,omitempty" comment:"birthday"`
	Sex      types.Sex  `json:"sex,omitempty" xml:"sex,attr,omitempty" cbor:"sex,omitempty" yaml:"sex,omitempty" comment:"sex"`
	Nickname string     `json:"nickname,omitempty" xml:"nickname,omitempty" cbor:"nickname,omitempty" yaml:"nickname,omitempty" comment:"nickname"`
	Avatar   string     `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty" comment:"avatar"`
	Level    int64      `json:"level,omitempty" yaml:"level,omitempty" xml:"level,attr,omitempty" cbor:"level,omitempty"`
	Type     int64      `json:"type,omitempty" yaml:"type,omitempty" xml:"type,attr,omitempty" cbor:"type,omitempty"`
	Inviter  int64      `json:"inviter,omitempty" yaml:"inviter,omitempty" xml:"inviter,omitempty" cbor:"inviter,omitempty" comment:"inviter"`
}

func (mem *adminInfoTO) Filter(v *web.FilterContext) {
	birthday := filter.NewBuilder(filter.V(validator.ZeroOr(func(t time.Time) bool {
		return t.After(time.Now())
	}), locales.InvalidValue))

	v.Add(filters.NotEmpty("username", &mem.Username)).
		Add(user.StateFilter("state", &mem.State)).
		Add(filters.NotEmpty("password", &mem.Password)).
		Add(birthday("birthday", &mem.Birthday)).
		Add(filter.NewBuilder(filter.V(validator.ZeroOr(types.SexValidator), locales.InvalidValue))("sex", &mem.Sex)).
		Add(filters.Avatar("avatar", &mem.Avatar)).
		Add(filters.Avatar("avatar", &mem.Avatar)) // TODO intviter
}

func (mem *adminInfoTO) toInfo() *RegisterInfo {
	return &RegisterInfo{
		Username: mem.Username,
		Password: mem.Password,
		Birthday: mem.Birthday,
		Sex:      mem.Sex,
		Nickname: mem.Nickname,
		Avatar:   mem.Avatar,
		Level:    mem.Level,
		Type:     mem.Type,
		Inviter:  mem.Inviter,
	}
}

func (m *Module) adminPostMembers(ctx *web.Context) web.Responser {
	data := &adminInfoTO{m: m}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	msg := web.Phrase("add by admin %d", m.admin.CurrentUser(ctx).ID).LocaleString(ctx.LocalePrinter())
	if _, err := m.Add(data.State, data.toInfo(), ctx.ClientIP(), ctx.Request().UserAgent(), msg); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
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

func (m *Module) getLevels(ctx *web.Context) web.Responser {
	l, err := m.levels.Get()
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(l)
}

func (m *Module) getTypes(ctx *web.Context) web.Responser {
	l, err := m.types.Get()
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(l)
}
