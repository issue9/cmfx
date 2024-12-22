// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"cmp"
	"slices"
	"time"

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

type sseTokenVO struct {
	XMLName struct{} `json:"-" xml:"token" cbor:"-" yaml:"-"`
	Access  string   `json:"access" xml:"access" cbor:"access" yaml:"access"`
	Expire  int      `json:"expire" xml:"expire,attr" cbor:"expire" yaml:"expire"`
}

const sseTokenExpireInSeconds = 60

func (m *Module) postSSE(ctx *web.Context) web.Responser {
	s := m.UserModule().Module().Server()
	token := s.UniqueID()

	m.sseCaches.Set(token, m.UserModule().CurrentUser(ctx).ID, sseTokenExpireInSeconds*time.Second)
	return web.Created(&sseTokenVO{
		Access: token,
		Expire: sseTokenExpireInSeconds,
	}, "")
}

func (m *Module) getSSE(ctx *web.Context) web.Responser {
	q, err := ctx.Queries(true)
	if err != nil {
		return ctx.Error(err, "")
	}

	token := q.String("token", "")
	if token == "" {
		return ctx.Problem(cmfx.UnauthorizedInvalidToken)
	}

	var uid int64
	if err = m.sseCaches.Get(token, &uid); err != nil {
		return ctx.Error(err, cmfx.UnauthorizedInvalidAccount)
	}

	src, wait := m.sse.NewSource(uid, ctx)
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

	ps := make([]*passportIdentityVO, 0)
	for k, v := range m.user.Identities(u.ID) {
		ps = append(ps, &passportIdentityVO{
			ID:       k,
			Identity: v,
		})
	}
	slices.SortFunc(ps, func(a, b *passportIdentityVO) int { return cmp.Compare(a.ID, b.ID) }) // 排序，尽量使输出的内容相同

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
