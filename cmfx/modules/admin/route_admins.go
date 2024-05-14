// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"errors"
	"net/http"

	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

// # API GET /admins/{id} 获取指定的管理员账号
//
// @tag admin
// @path id int 管理的 ID
// @resp 200 * respInfoWithRoleState
func (m *Module) getAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	a := &modelInfo{ID: id}
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

	return web.OK(&respInfoWithRoleState{
		respInfo: respInfo{
			ID:       a.ID,
			Sex:      a.Sex,
			Name:     a.Name,
			Nickname: a.Nickname,
			Avatar:   a.Avatar,
		},
		Roles: rs,
		State: u.State,
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
// @resp 200 * github.com/issue9/cmfx/cmfx/query.Page[respInfoWithRoleState]
func (m *Module) getAdmins(ctx *web.Context) web.Responser {
	q := &queryAdmins{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.Module().DB().SQLBuilder().Select().Column("*").From(orm.TableName(&modelInfo{}), "info")

	if len(q.States) > 0 {
		m.user.LeftJoin(sql, "user", "user.id=info.id", q.States)
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

	type info struct {
		modelInfo
		Roles []string   `orm:"roles"`
		State user.State `orm:"state"`
	}

	return query.PagingResponserWithConvert[info, respInfoWithRoleState](ctx, &q.Limit, sql, func(i *info) *respInfoWithRoleState {
		roles := m.roleGroup.UserRoles(i.ID)
		rs := make([]string, 0, len(roles))
		for _, r := range roles {
			rs = append(rs, r.ID)
		}

		return &respInfoWithRoleState{
			respInfo: respInfo{
				ID:       i.ID,
				Sex:      i.Sex,
				Name:     i.Name,
				Nickname: i.Nickname,
				Avatar:   i.Avatar,
			},
			Roles: rs,
			State: i.State,
		}
	})
}

// # api PATCH /admins/{id} 更新管理员信息
// @path id int 管理的 ID
// @tag admin
// @req * respInfoWithRoleState
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
	data := &respInfoWithRoleState{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	// 更新数据库
	aa := &modelInfo{
		ID:       id,
		Name:     data.Name,
		Nickname: data.Nickname,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
	}

	tx, err := m.Module().DB().Begin()
	if err != nil {
		return ctx.Error(err, "")
	}

	e := tx.NewEngine(m.Module().DB().TablePrefix())
	if _, err := e.Update(aa, "sex"); err != nil {
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
// @path id int 管理的 ID
func (m *Module) deleteAdminPassword(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	if _, err := m.user.GetUser(id); err != nil {
		return ctx.Error(err, "")
	}

	// 更新数据库
	if err := m.password.Set(id, defaultPassword); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// # api POST /admins 添加管理员账号
// @tag admin
// @req * respInfoWithAccount
// @resp 201 * {}
func (m *Module) postAdmins(ctx *web.Context) web.Responser {
	data := &respInfoWithAccount{respInfoWithRoleState: respInfoWithRoleState{respInfo: respInfo{m: m}}}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := m.newAdmin(m.password, data, ctx.Begin()); err != nil {
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

	if err := m.user.SetState(nil, u, state); err != nil {
		return ctx.Error(err, "")
	}

	return web.Status(code)
}
