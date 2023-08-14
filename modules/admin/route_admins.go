// SPDX-License-Identifier: MIT

package admin

import (
	"net/http"
	"strconv"

	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/orm/v5/types"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/locales"
	"github.com/issue9/cmfx/pkg/filters"
	"github.com/issue9/cmfx/pkg/query"
)

// # API GET /admins/{id} 获取指定的管理员账号
//
// @tag admin
// @path id int 管理的 ID
// @resp 200 * ModelAdmin
func (m *Admin) getAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	a := &modelAdmin{ID: id}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if !found {
		return ctx.NotFound()
	}

	return web.OK(a)
}

type adminsQuery struct {
	query.Text
	Groups []int64 `query:"group"`
	States []State `query:"state,normal"`
	Sexes  []Sex   `query:"sex"`
	m      *Admin
}

func (q *adminsQuery) CTXFilter(v *web.FilterProblem) {
	q.Text.CTXFilter(v)

	g := filter.NewSliceRule[int64, []int64](func(v int64) bool {
		return q.m.rbac.Role(v) != nil
	}, web.Phrase("group not exists"))
	v.AddFilter(filter.New(g)("group", &q.Groups)).
		AddFilter(StateSliceFilter("state", &q.States)).
		AddFilter(SexSliceFilter("sex", &q.Sexes))
}

// # API GET /admins 获取所有的管理员账号
//
// @tag admin
// @query adminsQuery
// @resp 200 * github.com/issue9/cmfx/pkg/query.Page[ModelAdmin]
func (m *Admin) getAdmins(ctx *web.Context) web.Responser {
	q := &adminsQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().Column("*").From(m.dbPrefix.TableName(&modelAdmin{}))

	if len(q.States) > 0 {
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, state := range q.States {
				ws.Or("{state}=?", int8(state))
			}
		})
	}

	if len(q.Groups) > 0 {
		// TODO
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, g := range q.Groups {
				gg := strconv.Itoa(int(g))
				ws.Or("(groups LIKE ? or groups LIKE ? or groups LIKE ?)", ","+gg+",", ","+gg, gg+",")
			}
		})
	}
	if len(q.Sexes) > 0 {
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, g := range q.Sexes {
				ws.Or("{sex}=?", g)
			}
		})
	}
	if len(q.Text.Text) > 0 {
		text := "%" + q.Text.Text + "%"
		sql.And("(username LIKE ? OR name LIKE ? OR nickname LIKE ?)", text, text, text)
	}

	return query.PagingResponser[modelAdmin](ctx, &q.Limit, sql, nil)
}

// # api PATCH /admins/{id} 更新管理员信息
// @path id int 管理的 ID
// @tag admin
// @req * postAdminInfo
// @resp 204 * {}
func (m *Admin) patchAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	a := &modelAdmin{ID: id}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if !found {
		return ctx.NotFound()
	}

	// 读取数据
	data := &postAdminInfo{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if a.Super && data.State != StateNormal {
		p := ctx.Problem(cmfx.BadRequestInvalidBody)
		p.AddParam("state", locales.InvalidValue.LocaleString(ctx.LocalePrinter()))
		return p
	}

	// 更新数据库
	aa := &modelAdmin{
		ID:       id,
		State:    data.State,
		Name:     data.Name,
		Nickname: data.Nickname,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
	}

	tx, err := m.db.Begin()
	if err != nil {
		return ctx.InternalServerError(err)
	}

	e := m.dbPrefix.Tx(tx)
	if _, err := e.Update(aa, "state", "sex"); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := m.rbac.Link(tx, id, data.Groups...); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := tx.Commit(); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.NoContent()
}

// # api DELETE /admins/{id}/password 重置管理员的密码
// @tag admin
// @resp 204 * {}
// @path id int 管理的 ID
func (m *Admin) deleteAdminPassword(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	a := &modelAdmin{ID: id}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if !found {
		return ctx.NotFound()
	}

	// 更新数据库
	if err := m.password.Set(nil, a.ID, defaultPassword); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.NoContent()
}

type postAdminInfo struct {
	State    State                `json:"state" xml:"state,attr"`
	Sex      Sex                  `json:"sex" xml:"sex,attr"`
	Name     string               `json:"name" xml:"name"`
	Nickname string               `json:"nickname" xml:"nickname"`
	Username string               `json:"username" xml:"username"`
	Password string               `json:"password" xml:"password"`
	Groups   types.SliceOf[int64] `json:"groups" xml:"groups"`
	Avatar   string               `json:"avatar,omitempty" xml:"avatar,attr,omitempty"`
	m        *Admin
}

func (i *postAdminInfo) CTXFilter(v *web.FilterProblem) {
	switch v.Context().Request().Method {
	case http.MethodPost, http.MethodPut:
		v.AddFilter(filter.New(StateRule)("state", &i.State)).
			AddFilter(filters.RequiredString("name", &i.Name)).
			AddFilter(filters.RequiredString("username", &i.Username)).
			AddFilter(filters.RequiredString("nickname", &i.Nickname)).
			AddFilter(filters.RequiredString("password", &i.Password)).
			AddFilter(filters.Avatar("avatar", &i.Avatar)).

			// i.Groups
			When(len(i.Groups) > 0, func(v *web.FilterProblem) {
				g := filter.NewSliceRule[int64, types.SliceOf[int64]](func(val int64) bool {
					return i.m.rbac.Role(val) != nil
				}, web.Phrase("group not exists"))
				v.AddFilter(filter.New(g)("groups", &i.Groups))
			}).
			When(len(i.Groups) == 0, func(v *web.FilterProblem) {
				v.Add("groups", locales.Required)
			}).
			AddFilter(filter.New(filter.NewSliceRule[int64, types.SliceOf[int64]](func(int64) bool {
				ok, err := i.m.IsAllowChangeRole(v.Context(), i.Groups)
				if err != nil {
					v.Context().Logs().ERROR().Error(err)
				}
				return ok
			}, locales.InvalidValue))("groups", &i.Groups))
	case http.MethodPatch:
		v.AddFilter(filter.New(StateRule)("state", &i.State)).
			AddFilter(filters.Avatar("avatar", &i.Avatar)).

			// i.Groups
			When(len(i.Groups) > 0, func(v *web.FilterProblem) {
				g := filter.NewSliceRule[int64, types.SliceOf[int64]](func(val int64) bool {
					return i.m.rbac.Role(val) != nil
				}, web.Phrase("group not exists"))
				v.AddFilter(filter.New(g)("groups", &i.Groups))
			}).
			AddFilter(filter.New(filter.NewSliceRule[int64, types.SliceOf[int64]](func(int64) bool {
				ok, err := i.m.IsAllowChangeRole(v.Context(), i.Groups)
				if err != nil {
					v.Context().Logs().ERROR().Error(err)
				}
				return ok
			}, locales.InvalidValue))("groups", &i.Groups))
	}
}

// # api POST /admins 添加管理员账号
// @tag admin
// @req * postAdminInfo
// @resp 201 * {}
func (m *Admin) postAdmins(ctx *web.Context) web.Responser {
	data := &postAdminInfo{m: m}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := &modelAdmin{
		State:    data.State,
		Nickname: data.Nickname,
		Name:     data.Name,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
		Username: data.Username,
	}

	tx, err := m.db.Begin()
	if err != nil {
		return ctx.InternalServerError(err)
	}

	id, err := m.dbPrefix.Tx(tx).LastInsertID(a)
	if err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := m.rbac.Link(tx, id, data.Groups...); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := m.password.Add(tx, id, data.Username, data.Password); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := tx.Commit(); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.Created(nil, "")
}

// # api POST /admins/{id}/locked 锁定管理员
// @tag admin
// @resp 201 * {}
func (m *Admin) postAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateLocked, http.StatusCreated)
}

// # api POST /admins/{id}/left 设定为离职状态
// @tag admin
// @path id id 管理员的 ID
// @resp 201 * {}
func (m *Admin) postAdminLeft(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateLeft, http.StatusCreated)
}

// # api delete /admins/{id}/locked 解除锁定
// @tag admin
// @path id id 管理员的 ID
// @resp 204 * {}
func (m *Admin) deleteAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateNormal, http.StatusNoContent)
}

// # api delete /admins/{id}/left 恢复正常属性
// @tag admin
// @path id id 管理员的 ID
// @resp 204 * {}
func (m *Admin) deleteAdminLeft(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateNormal, http.StatusNoContent)
}

func (m *Admin) setAdminState(ctx *web.Context, state State, code int) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	e := m.dbPrefix.DB(m.db)

	a := &modelAdmin{ID: id}
	found, err := e.Select(a)
	if !found {
		return ctx.NotFound()
	}
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if a.Super {
		return ctx.Problem(forbiddenIsSuper)
	}
	if a.State == state { // 无须修改状态
		goto END
	}

	if _, err := e.Update(&modelAdmin{ID: id, State: state}, "state"); err != nil {
		return ctx.InternalServerError(err)
	}

	// 非正常状态，则要注销该用户的登录
	if state != StateNormal {
		if err := m.tokenServer.BlockUID(formatUID(a.ID)); err != nil {
			ctx.Logs().ERROR().Error(err)
		}
	} else {
		if err := m.tokenServer.RecoverUID(formatUID(a.ID)); err != nil {
			ctx.Logs().ERROR().Error(err)
		}
	}

END:
	return web.Status(code)
}

// # api post /admins/{id}/super 将该用户设置为超级管理员
// @tag admin
// @path id id 管理员的 ID
// @resp 201 * {}
func (m *Admin) postSuper(ctx *web.Context) web.Responser {
	a := m.LoginUser(ctx)
	if !a.Super {
		return ctx.Problem(forbiddenOnlySuper)
	}

	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	a1 := &modelAdmin{ID: id}
	found, err := m.dbPrefix.DB(m.db).Select(a1)
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if !found {
		return ctx.NotFound()
	}

	tx, err := m.db.Begin()
	if err != nil {
		return ctx.InternalServerError(err)
	}

	t := m.dbPrefix.Tx(tx)

	if _, err := t.Update(&modelAdmin{ID: a.ID, Super: false}, "super"); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if _, err := t.Update(&modelAdmin{ID: id, Super: true}, "super"); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := tx.Commit(); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.Created(nil, "")
}
