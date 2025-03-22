// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"cmp"
	"net/http"
	"slices"
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
)

type infoWithPassportVO struct {
	info
	Passports []*user.IdentityVO `json:"passports" xml:"passports" cbor:"passports" yaml:"passports" toml:"passports"`
}

func (m *Module) postSSE(ctx *web.Context) web.Responser {
	return m.temp.New(ctx, m.CurrentUser(ctx), http.StatusCreated)
}

func (m *Module) getSSE(ctx *web.Context) web.Responser {
	u, found := m.temp.GetInfo(ctx)
	if !found {
		return ctx.Problem(cmfx.Unauthorized)
	}

	src, wait := m.sse.NewSource(u.ID, ctx)
	src.Sent([]string{ctx.Begin().Format(time.RFC3339)}, "connect", "")
	wait()
	return nil
}

func (m *Module) getInfo(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	information := &info{ID: u.ID}
	f, err := m.UserModule().Module().DB().Select(information)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !f {
		return ctx.NotFound()
	}

	ps := slices.Collect(m.user.Identities(u.ID))
	slices.SortFunc(ps, func(a, b *user.IdentityVO) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

	return web.OK(&infoWithPassportVO{
		info:      *information,
		Passports: ps,
	})
}

func (m *Module) patchInfo(ctx *web.Context) web.Responser {
	data := &info{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := m.CurrentUser(ctx)

	data.ID = a.ID // 确保 ID 正确
	_, err := m.UserModule().Module().DB().Update(data)
	if err != nil {
		return ctx.Error(err, "")
	}

	if err := m.user.AddSecurityLogFromContext(nil, a.ID, ctx, web.StringPhrase("update info")); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}
