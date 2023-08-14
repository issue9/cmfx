// SPDX-License-Identifier: MIT

package admin

import (
	"errors"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/filters"
)

// # api get /info 获取当前登用户的信息
// @tag admin
// @resp 200 * ModelAdmin
func (m *Admin) getInfo(ctx *web.Context) web.Responser {
	return web.OK(m.LoginUser(ctx))
}

type info struct {
	XMLName  struct{} `json:"-" xml:"info"`
	Nickname string   `json:"nickname" xml:"nickname"`
	Avatar   string   `json:"avatar" xml:"avatar"`
}

func (i *info) CTXFilter(v *web.FilterProblem) {
	v.AddFilter(filters.RequiredString("nickname", &i.Nickname)).
		AddFilter(filters.Avatar("avatar", &i.Avatar))
}

// # api patch /info 更新当前登用户的信息
// @tag admin
// @req * info
// @resp 204 * {}
func (m *Admin) patchInfo(ctx *web.Context) web.Responser {
	data := &info{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := m.LoginUser(ctx)

	_, err := m.dbPrefix.DB(m.db).Update(&modelAdmin{
		ID:       a.ID,
		Nickname: data.Nickname,
		Avatar:   data.Avatar,
	})
	if err != nil {
		return ctx.InternalServerError(err)
	}

	m.AddSecurityLogWithContext(a.ID, ctx, "更新个人信息")

	return web.NoContent()
}

type pwd struct {
	XMLName struct{} `json:"-" xml:"password"`
	Old     string   `json:"old" xml:"old"`
	New     string   `json:"new" xml:"new"`
}

func (p *pwd) CTXFilter(v *web.FilterProblem) {
	same := filter.NewRule(func(s string) bool { return s == p.Old }, web.StringPhrase("same of new and old password"))
	v.AddFilter(filters.RequiredString("old", &p.Old)).
		AddFilter(filters.RequiredString("new", &p.New)).
		AddFilter(filter.New(same)("new", &p.New))
}

// # api put /password 当前登录用户修改自己的密码
// @tag admin
// @req * pwd
// @resp 204 * {}
func (m *Admin) putCurrentPassword(ctx *web.Context) web.Responser {
	data := &pwd{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := m.LoginUser(ctx)
	err := m.password.Change(nil, a.ID, data.Old, data.New)
	if errors.Is(err, authenticator.ErrUnauthorized) {
		return ctx.Problem(cmfx.Unauthorized)
	} else if err != nil {
		return ctx.InternalServerError(err)
	}

	if err := m.tokenServer.BlockToken(m.tokenServer.GetToken(ctx)); err != nil {
		return ctx.InternalServerError(err)
	}

	m.AddSecurityLogWithContext(a.ID, ctx, "修改密码")

	return web.NoContent()
}

// # api get /securitylog 当前用户的安全操作记录
// @tag admin
// @query github.com/issue9/cmfx/pkg/securitylog.logQuery
// @resp 200 * github.com/issue9/cmfx/pkg/query.Page[github.com/issue9/cmfx/pkg/securitylog.Log]
func (m *Admin) getSecurityLogs(ctx *web.Context) web.Responser {
	if u := m.LoginUser(ctx); u != nil {
		return m.securitylog.GetHandle(u.ID, ctx)
	}
	return ctx.Problem(cmfx.Unauthorized)
}
