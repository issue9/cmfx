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

// <api method="get" summary="获取指定的管理员账号">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="200" type="object">
//	    <param name="id" type="number" summary="用户 ID" />
//	    <param name="username" type="string" summary="登录账号" />
//	    <param name="state" type="string" summary="状态值">
//	        <enum value="normal" summary="正常" />
//	        <enum value="locked" summary="锁定" />
//	        <enum value="left" summary="离职" />
//	    </param>
//	    <param name="sex" type="string" summary="性别">
//	        <enum value="male" summary="男" />
//	        <enum value="female" summary="女" />
//	        <enum value="unknown" summary="未设置" />
//	    </param>
//	    <param name="name" type="string" summary="真实姓名" />
//	    <param name="nickname" type="string" summary="姓名" />
//	    <param name="groups" type="number" array="true" summary="权限组 ID" />
//	</response>
//
// </api>
func (m *Admin) getAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	a := &ModelAdmin{ID: id}
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

// <api method="get" summary="获取所有的管理员账号">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins">
//	    <query name="size" type="number" default="20" summary="每页数量" />
//	    <query name="page" type="number" default="0" summary="页码，起始页 0" />
//	    <query name="group" type="number" array="true" summary="只显示该分组的，可以为空，表示所有。" />
//	    <query name="state" type="string" array="true" default="normal" summary="状态值">
//	        <enum value="normal" summary="正常" />
//	        <enum value="locked" summary="锁定" />
//	        <enum value="left" summary="离职" />
//	    </query>
//	    <query name="sex" type="string" array="true" summary="性别">
//	        <enum value="male" summary="男" />
//	        <enum value="female" summary="女" />
//	        <enum value="unknown" summary="未设置" />
//	    </query>
//	    <query name="text" type="string" default="" summary="查询的文本内容，可以是姓名，账号等" />
//	</path>
//	<response type="object" status="200">
//	    <param name="count" type="number" summary="符合条件的数量，去除 page, size 的影响" />
//	    <param name="current" type="object" array="true" summary="当前页数据">
//	        <param name="id" type="number" summary="用户 ID" />
//	        <param name="state" type="string" summary="状态值">
//	            <enum value="normal" summary="正常" />
//	            <enum value="locked" summary="锁定" />
//	            <enum value="left" summary="离职" />
//	        </param>
//	        <param name="name" type="string" summary="真实姓名" />
//	        <param name="nickname" type="string" summary="姓名" />
//	        <param name="groups" type="number" array="true" summary="权限组 ID" />
//	        <param name="username" type="string" summary="登录账号" />
//	    </param>
//	</response>
//
// </api>
func (m *Admin) getAdmins(ctx *web.Context) web.Responser {
	q := &adminsQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().Column("*").From(m.dbPrefix.TableName(&ModelAdmin{}))

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

	return query.PagingResponser[ModelAdmin](ctx, &q.Limit, sql, nil)
}

// <api method="patch" summary="修改指定的管理员账号">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<request type="object">
//	    <param name="state" type="string" summary="状态值" xml-attr="true">
//	        <enum value="normal" summary="正常" />
//	        <enum value="locked" summary="锁定" />
//	        <enum value="left" summary="离职" />
//	    </param>
//	    <param name="sex" type="string" summary="性别">
//	        <enum value="male" summary="男" />
//	        <enum value="female" summary="女" />
//	        <enum value="unknown" summary="未设置" />
//	    </param>
//	    <param name="name" type="string" summary="真实姓名" />
//	    <param name="nickname" type="string" summary="姓名" />
//	    <param name="groups" type="number" array="true" summary="权限组" />
//	    <param name="avatar" type="string.url" xml-attr="true" summary="头像地址" />
//	</request>
//	<response status="204" />
//
// </api>
func (m *Admin) patchAdmin(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	a := &ModelAdmin{ID: id}
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
	aa := &ModelAdmin{
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

// <api method="put" summary="重置管理员的密码">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}/password">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="204" />
//
// </api>
func (m *Admin) deleteAdminPassword(ctx *web.Context) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	// 查看指定的用户是否真实存在，不判断状态，即使锁定，也能改其信息
	a := &ModelAdmin{ID: id}
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

// <api method="post" summary="添加管理员账号">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins" />
//	<request type="object">
//	    <param name="state" type="string" summary="状态值">
//	        <enum value="normal" summary="正常" />
//	        <enum value="locked" summary="锁定" />
//	        <enum value="left" summary="离职" />
//	    </param>
//	    <param name="sex" type="string" summary="性别">
//	        <enum value="male" summary="男" />
//	        <enum value="female" summary="女" />
//	        <enum value="unknown" summary="未设置" />
//	    </param>
//	    <param name="username" type="string" summary="登录账号" />
//	    <param name="name" type="string" summary="真实姓名" />
//	    <param name="nickname" type="string" summary="昵称" />
//	    <param name="groups" type="number" array="true" summary="权限组" />
//	    <param name="password" type="string" summary="密码" />
//	    <param name="avatar" type="string.url" summary="头像" />
//	</request>
//	<response status="201" />
//
// </api>
func (m *Admin) postAdmins(ctx *web.Context) web.Responser {
	data := &postAdminInfo{m: m}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := &ModelAdmin{
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

// <api method="POST" summary="锁定管理员">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}/locked">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="201" />
//
// </api>
func (m *Admin) postAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateLocked, http.StatusCreated)
}

// <api method="POST" summary="设定为离职状态">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}/left">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="201" />
//
// </api>
func (m *Admin) postAdminLeft(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateLeft, http.StatusCreated)
}

// <api method="delete" summary="解除锁定">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}/locked">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="204" />
//
// </api>
func (m *Admin) deleteAdminLocked(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateNormal, http.StatusNoContent)
}

// <api method="delete" summary="恢复正常属性">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}/left">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="204" />
//
// </api>
func (m *Admin) deleteAdminLeft(ctx *web.Context) web.Responser {
	return m.setAdminState(ctx, StateNormal, http.StatusNoContent)
}

func (m *Admin) setAdminState(ctx *web.Context, state State, code int) web.Responser {
	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	e := m.dbPrefix.DB(m.db)

	a := &ModelAdmin{ID: id}
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

	if _, err := e.Update(&ModelAdmin{ID: id, State: state}, "state"); err != nil {
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

// <api method="POST" summary="将该用户设置为超级管理员">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/admins/{id}/super">
//	    <param name="id" type="number" summary="管理员的 ID" />
//	</path>
//	<response status="201" />
//
// </api>
func (m *Admin) postSuper(ctx *web.Context) web.Responser {
	a := m.LoginUser(ctx)
	if !a.Super {
		return ctx.Problem(forbiddenOnlySuper)
	}

	id, resp := ctx.PathID("id", cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	a1 := &ModelAdmin{ID: id}
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

	if _, err := t.Update(&ModelAdmin{ID: a.ID, Super: false}, "super"); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if _, err := t.Update(&ModelAdmin{ID: id, Super: true}, "super"); err != nil {
		tx.Rollback()
		return ctx.InternalServerError(err)
	}

	if err := tx.Commit(); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.Created(nil, "")
}
