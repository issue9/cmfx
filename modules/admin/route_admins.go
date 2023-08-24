// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"

	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/query"
	"github.com/issue9/cmfx/pkg/user"
)

// # API GET /admins/{id} 获取指定的管理员账号
//
// @tag admin
// @path id int 管理的 ID
// @resp 200 * respInfoWithRoleState
func (m *Admin) getAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	a := &modelInfo{ID: id}
	found, err := m.user.DBEngine(nil).Select(a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	roles := m.rbac.UserRoles(id)
	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(&respInfoWithRoleState{
		respInfo: respInfo{
			ID:       a.ID,
			Sex:      a.Sex,
			Name:     a.Name,
			Nickname: a.Nickname,
			Avatar:   a.Avatar,
		},
		Roles: roles,
		State: u.State,
	})
}

type adminsQuery struct {
	query.Text
	Roles  []int64      `query:"role"`
	States []user.State `query:"state,normal"`
	Sexes  []cmfx.Sex   `query:"sex"`
	m      *Admin
}

func (q *adminsQuery) CTXFilter(v *web.FilterProblem) {
	q.Text.CTXFilter(v)

	g := filter.NewSliceRule[int64, []int64](q.m.rbac.RoleExists, web.Phrase("roles not exists"))
	v.AddFilter(filter.New(g)("roles", &q.Roles)).
		AddFilter(user.StateSliceFilter("state", &q.States)).
		AddFilter(cmfx.SexSliceFilter("sex", &q.Sexes))
}

// # API GET /admins 获取所有的管理员账号
//
// @tag admin
// @query adminsQuery
// @resp 200 * github.com/issue9/cmfx/pkg/query.Page[respInfoWithRoleState]
func (m *Admin) getAdmins(ctx *web.Context) web.Responser {
	q := &adminsQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	mod := m.user
	sql := mod.DB().SQLBuilder().Select().Column("*").From(mod.DBPrefix().TableName(&modelInfo{}), "info")

	if len(q.States) > 0 {
		m.user.LeftJoin(sql, "user", "user.id=info.id", q.States)
	}

	if len(q.Roles) > 0 {
		m.rbac.LeftJoin(sql, "rbac", "rbac.uid=info.id", q.Roles)
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
		Roles []int64    `orm:"roles"`
		State user.State `orm:"state"`
	}

	return query.PagingResponserWithConvert[info, respInfoWithRoleState](ctx, &q.Limit, sql, func(i *info) *respInfoWithRoleState {
		return &respInfoWithRoleState{
			respInfo: respInfo{
				ID:       i.ID,
				Sex:      i.Sex,
				Name:     i.Name,
				Nickname: i.Nickname,
				Avatar:   i.Avatar,
			},
			Roles: i.Roles,
			State: i.State,
		}
	})
}

// # api PATCH /admins/{id} 更新管理员信息
// @path id int 管理的 ID
// @tag admin
// @req * respInfoWithRoleState
// @resp 204 * {}
func (m *Admin) patchAdmin(ctx *web.Context) web.Responser {
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

	tx, err := m.user.DB().Begin()
	if err != nil {
		return ctx.Error(err, "")
	}

	e := m.user.DBEngine(tx)
	if _, err := e.Update(aa, "sex"); err != nil {
		tx.Rollback()
		return ctx.Error(err, "")
	}

	if err := m.rbac.Link(tx, id, data.Roles...); err != nil {
		tx.Rollback()
		return ctx.Error(err, "")
	}

	if err := m.user.SetState(tx, u, data.State); err != nil {
		tx.Rollback()
		return ctx.Error(err, "")
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
func (m *Admin) deleteAdminPassword(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	if _, err := m.user.GetUser(id); err != nil {
		return ctx.Error(err, "")
	}

	// 更新数据库
	if err := m.password.Set(nil, id, defaultPassword); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// # api POST /admins 添加管理员账号
// @tag admin
// @req * respInfoWithAccount
// @resp 201 * {}
func (m *Admin) postAdmins(ctx *web.Context) web.Responser {
	data := &respInfoWithAccount{respInfoWithRoleState: respInfoWithRoleState{respInfo: respInfo{m: m}}}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := newAdmin(m.user, m.rbac, m.password, data); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// # api POST /admins/{id}/locked 锁定管理员
// @tag admin
// @resp 201 * {}
func (m *Admin) postAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateLocked, http.StatusCreated)
}

// # api delete /admins/{id} 删除管理员
// @tag admin
// @path id id 管理员的 ID
// @resp 201 * {}
func (m *Admin) deleteAdmin(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateDeleted, http.StatusCreated)
}

// # api delete /admins/{id}/locked 解除锁定
// @tag admin
// @path id id 管理员的 ID
// @resp 204 * {}
func (m *Admin) deleteAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, user.StateNormal, http.StatusNoContent)
}

func (m *Admin) setAdminState(ctx *web.Context, state user.State, code int) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	if m.rbac.IsSuper(id) {
		return ctx.Problem(forbiddenIsSuper)
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

// # api post /admins/{id}/super 将该用户设置为超级管理员
// @tag admin
// @path id id 管理员的 ID
// @resp 201 * {}
func (m *Admin) postSuper(ctx *web.Context) web.Responser {
	a := m.LoginUser(ctx)
	if !m.rbac.IsSuper(a.ID) {
		return ctx.Problem(forbiddenOnlySuper)
	}

	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	u, err := m.user.GetUser(id)
	if err != nil {
		return ctx.Error(err, "")
	}

	if err = m.rbac.SetSuper(nil, u.ID); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}
