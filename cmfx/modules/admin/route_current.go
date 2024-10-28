// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
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

// # api get /securitylog 当前用户的安全操作记录
// @tag admin
// @query github.com/issue9/cmfx/cmfx/user.queryLog
// @resp 200 * github.com/issue9/cmfx/cmfx/query.Page[github.com/issue9/cmfx/cmfx/user.respLog]
func (m *Module) getSecurityLogs(ctx *web.Context) web.Responser {
	return m.user.GetSecurityLogs(ctx)
}
