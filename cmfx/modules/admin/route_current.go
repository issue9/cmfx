// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"cmp"
	"slices"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

type passportIdentityVO struct {
	ID       string `json:"id" xml:"id" cbor:"id" yaml:"id"`
	Identity string `json:"identity" xml:"identity" cbor:"identity" yaml:"id"`
}

type infoWithPassportVO struct {
	info
	Passports []*passportIdentityVO `json:"passports" xml:"passports" cbor:"passports" yaml:"passports"`
}

// # api get /info 获取当前登用户的信息
// @tag admin
// @resp 200 * respInfoWithPassport
func (m *Module) getInfo(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	infomation := &info{ID: u.ID}
	f, err := m.UserModule().Module().DB().Select(infomation)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !f {
		return ctx.NotFound()
	}

	ps := make([]*passportIdentityVO, 0)
	for k, v := range m.user.Identities(u.ID) {
		ps = append(ps, &passportIdentityVO{
			ID:       k,
			Identity: v,
		})
	}
	slices.SortFunc(ps, func(a, b *passportIdentityVO) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

	return web.OK(&infoWithPassportVO{
		info:      *infomation,
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
