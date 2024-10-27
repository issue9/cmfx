// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"cmp"
	"errors"
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

type respAdminInfo struct {
	ctxInfoWithRoleState

	// 当前用户已经开通的验证方式
	Passports []*respPassportIdentity `json:"passports" xml:"passports" cbor:"passports"`
}

type respPassportIdentity struct {
	Name     string `json:"name" xml:"name" cbor:"name"`
	Identity string `json:"identity" xml:"identity" cbor:"identity"`
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

	roles := m.roleGroup.UserRoles(id)
	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	rs := make([]string, 0, len(roles))
	for _, r := range roles {
		rs = append(rs, r.ID)
	}

	ps := make([]*respPassportIdentity, 0)
	for k, v := range m.Passport().Identities(id) {
		ps = append(ps, &respPassportIdentity{
			Name:     k,
			Identity: v,
		})
	}
	slices.SortFunc(ps, func(a, b *respPassportIdentity) int { return cmp.Compare(a.Name, b.Name) }) // 排序，尽量使输出的内容相同

	return web.OK(&respAdminInfo{
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
	Roles  []string     `query:"role"`
	States []user.State `query:"state,normal"`
	Sexes  []types.Sex  `query:"sex"`
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

// # API GET /admins 获取所有的管理员账号
//
// @tag admin
// @query queryAdmins
// @resp 200 * github.com/issue9/cmfx/cmfx/query.Page[ctxInfoWithRoleState]
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

// # api PATCH /admins/{id} 更新管理员信息
// @path id int 管理的 ID
// @tag admin
// @req * ctxInfoWithRoleState
// @resp 204 * {}
func (m *Module) patchAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	// 读取数据
	data := &ctxInfoWithRoleState{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}
	data.ID = id // 指定主键

	tx, err := m.Module().DB().Begin()
	if err != nil {
		return ctx.Error(err, "")
	}

	e := tx.NewEngine(m.Module().DB().TablePrefix())
	if _, err := e.Update(data, "sex"); err != nil {
		return ctx.Error(errors.Join(err, tx.Rollback()), "")
	}

	for _, rid := range data.Roles {
		r := m.roleGroup.Role(rid)
		if r == nil {
			continue
		}

		if err := r.Link(id); err != nil {
			return ctx.Error(errors.Join(err, tx.Rollback()), "")
		}
	}

	if err := m.user.SetState(tx, u, data.State); err != nil {
		return ctx.Error(errors.Join(err, tx.Rollback()), "")
	}

	if err := tx.Commit(); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// # api DELETE /admins/{id}/password 重置管理员的密码
// @tag admin
// @resp 204 * {}
// @path id id 管理的 ID
func (m *Module) deleteAdminPassword(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}
	if u.State != user.StateNormal {
		return ctx.Problem(cmfx.ForbiddenStateNotAllow)
	}

	// 更新数据库
	if err := m.Passport().Get(passportTypePassword).Set(id, m.defaultPassword); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// # api POST /admins 添加管理员账号
// @tag admin
// @req * reqInfoWithAccount
// @resp 201 * {}
func (m *Module) postAdmins(ctx *web.Context) web.Responser {
	data := &reqInfoWithAccount{ctxInfoWithRoleState: ctxInfoWithRoleState{info: info{m: m}}}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := m.newAdmin(data, ctx.Begin()); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// # api POST /admins/{id}/locked 锁定管理员
// @tag admin
// @resp 201 * {}
func (m *Module) postAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateLocked, http.StatusCreated)
}

// # api delete /admins/{id} 删除管理员
// @tag admin
// @path id id 管理员的 ID
// @resp 201 * {}
func (m *Module) deleteAdmin(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateDeleted, http.StatusCreated)
}

// # api delete /admins/{id}/locked 解除锁定
// @tag admin
// @path id id 管理员的 ID
// @resp 204 * {}
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
