// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"errors"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

func (m *Module) getInfo(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	mod := &info{ID: u.ID}
	f, err := m.Module().DB().Select(mod)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !f {
		return ctx.NotFound()
	}
	return web.OK(mod)
}

func (m *Module) patchInfo(ctx *web.Context) web.Responser {
	data := &info{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := m.CurrentUser(ctx)

	data.ID = a.ID // 确保 ID 正确
	_, err := m.Module().DB().Update(data)
	if err != nil {
		return ctx.Error(err, "")
	}

	if err := m.user.AddSecurityLogFromContext(nil, a.ID, ctx, web.StringPhrase("update info")); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// 密码修改
type reqPassword struct {
	XMLName struct{} `json:"-" xml:"password" cbor:"-"`
	Old     string   `json:"old" xml:"old" cbor:"old"`
	New     string   `json:"new" xml:"new" cbor:"new"`
}

func (p *reqPassword) Filter(v *web.FilterContext) {
	same := filter.V(func(s string) bool {
		return s != p.Old
	}, web.StringPhrase("same of new and old password"))

	v.Add(filters.NotEmpty("old", &p.Old)).
		Add(filters.NotEmpty("new", &p.New)).
		Add(filter.NewBuilder(same)("new", &p.New))
}

// # api PUT /password 当前登录用户修改自己的密码
// @tag admin
// @req * reqPassword
// @resp 204 * {}
func (m *Module) putCurrentPassword(ctx *web.Context) web.Responser {
	data := &reqPassword{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := m.CurrentUser(ctx)
	err := m.Passport().Get(passportTypePassword).Change(a.ID, data.Old, data.New)
	if errors.Is(err, passport.ErrUnauthorized()) {
		return ctx.Problem(cmfx.Unauthorized)
	} else if err != nil {
		return ctx.Error(err, "")
	}

	return m.user.Logout(ctx, nil, web.StringPhrase("change password"))
}

func (m *Module) getSecurityLogs(ctx *web.Context) web.Responser {
	return m.user.GetSecurityLogs(ctx)
}
