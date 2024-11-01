// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

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
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

type adminInfoVO struct {
	ctxInfoWithRoleState

	// 当前用户已经开通的验证方式
	Passports []*respPassportIdentity `json:"passports" xml:"passports" cbor:"passports"`
}

// # API GET /admins/{id} 获取指定的管理员账号
//
// @tag admin
// @path id int 管理的 ID
// @resp 200 * respAdminInfo
func (m *Module) getAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	a := &info{ID: id}
	found, err := m.Module().DB().Select(a)
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

	rs := make([]string, 0, 4)
	for _, r := range m.roleGroup.UserRoles(id) {
		rs = append(rs, r.ID)
	}

	ps := make([]*respPassportIdentity, 0)
	for k, v := range m.Passport().Identities(id) {
		ps = append(ps, &respPassportIdentity{
			ID:       k,
			Username: v,
		})
	}
	slices.SortFunc(ps, func(a, b *respPassportIdentity) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

	return web.OK(&adminInfoVO{
		ctxInfoWithRoleState: ctxInfoWithRoleState{
			info:  *a,
			Roles: rs,
			State: u.State,
		},
		Passports: ps,
	})
}

type queryAdmins struct {
	query.Text
	Roles  []string     `query:"role" comment:"role"`
	States []user.State `query:"state,normal" comment:"state"`
	Sexes  []types.Sex  `query:"sex" comment:"sex"`
	m      *Module
}

func (q *queryAdmins) Filter(v *web.FilterContext) {
	q.Text.Filter(v)

	roleExists := func(r string) bool {
		return q.m.roleGroup.Role(r) != nil
	}

	g := filter.SV[[]string](roleExists, web.Phrase("roles not exists"))
	v.Add(filter.NewBuilder(g)("roles", &q.Roles)).
		Add(user.StateSliceFilter("state", &q.States)).
		Add(types.SexSliceFilter("sex", &q.Sexes))
}

func (m *Module) getAdmins(ctx *web.Context) web.Responser {
	q := &queryAdmins{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.Module().DB().SQLBuilder().Select().Column("info.*").From(orm.TableName(&info{}), "info")

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
		sql.And("(info.name LIKE ? OR info.nickname LIKE ?)", text, text)
	}

	type modelInfo struct {
		info
		NO      string        `orm:"name(no);len(32);unique(no)"` // 用户的唯一编号，一般用于前端
		Created time.Time     `orm:"name(created)"`               // 添加时间
		State   user.State    `orm:"name(state)"`                 // 状态
		Roles   types.Strings `orm:"roles"`
	}

	return query.PagingResponserWithConvert(ctx, &q.Limit, sql, func(i *modelInfo) *ctxInfoWithRoleState {
		roles := m.roleGroup.UserRoles(i.ID)
		rs := make([]string, 0, len(roles))
		for _, r := range roles {
			rs = append(rs, r.ID)
		}

		return &ctxInfoWithRoleState{
			info:    i.info,
			Roles:   rs,
			State:   i.State,
			NO:      i.NO,
			Created: i.Created,
		}
	})
}

func (m *Module) patchAdmin(ctx *web.Context) web.Responser {
	u, resp := m.getUserFromPath(ctx)
	if resp != nil {
		return resp
	}

	// 读取数据
	data := &ctxInfoWithRoleState{info: info{m: m}}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}
	data.ID = u.ID // 指定主键

	err := m.Module().DB().DoTransaction(func(tx *orm.Tx) error {
		e := tx.NewEngine(m.Module().DB().TablePrefix())
		if _, err := e.Update(&data.info, "sex"); err != nil {
			return err
		}

		return m.user.SetState(tx, u, data.State)
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	// 取消所有的权限组，可能涉及数据库操作，在事务外执行。
	for _, role := range m.roleGroup.UserRoles(u.ID) {
		if err := role.Unlink(u.ID); err != nil {
			return ctx.Error(err, "")
		}
	}
	for _, rid := range data.Roles {
		role := m.roleGroup.Role(rid)
		if role == nil { // 由 filter 保证不存在为 nil
			panic("role == nil")
		}

		if err := role.Link(u.ID); err != nil {
			return ctx.Error(err, "")
		}
	}

	return web.NoContent()
}

func (m *Module) postAdmins(ctx *web.Context) web.Responser {
	data := &infoWithAccountDTO{ctxInfoWithRoleState: ctxInfoWithRoleState{info: info{m: m}}}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := m.newAdmin(data, ctx.Begin()); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

func (m *Module) postAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateLocked, http.StatusCreated)
}

func (m *Module) deleteAdmin(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateDeleted, http.StatusNoContent)
}

func (m *Module) deleteAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateNormal, http.StatusNoContent)
}

func (m *Module) setAdminState(ctx *web.Context, state user.State, code int) web.Responser {
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
