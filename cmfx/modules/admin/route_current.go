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

// # api get /info 获取当前登用户的信息
// @tag admin
// @resp 200 * respInfo
func (l *Loader) getInfo(ctx *web.Context) web.Responser {
	return web.OK(l.LoginUser(ctx))
}

// # api patch /info 更新当前登用户的信息
// @tag admin
// @req * respInfo 更新的信息，将忽略 id
// @resp 204 * {}
func (l *Loader) patchInfo(ctx *web.Context) web.Responser {
	data := &respInfo{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := l.LoginUser(ctx)

	_, err := l.Module().DB().Update(&modelInfo{
		ID:       a.ID,
		Nickname: data.Nickname,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
		Name:     data.Name,
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	if err := l.user.AddSecurityLogFromContext(nil, a.ID, ctx, "更新个人信息"); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

type putPassword struct {
	XMLName struct{} `json:"-" xml:"password"`
	Old     string   `json:"old" xml:"old"`
	New     string   `json:"new" xml:"new"`
}

func (p *putPassword) Filter(v *web.FilterContext) {
	same := filter.V(func(s string) bool {
		return s == p.Old
	}, web.StringPhrase("same of new and old password"))

	v.Add(filters.NotEmpty("old", &p.Old)).
		Add(filters.NotEmpty("new", &p.New)).
		Add(filter.NewBuilder(same)("new", &p.New))
}

// # api put /password 当前登录用户修改自己的密码
// @tag admin
// @req * putPassword
// @resp 204 * {}
func (l *Loader) putCurrentPassword(ctx *web.Context) web.Responser {
	data := &putPassword{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	a := l.LoginUser(ctx)
	err := l.password.Change(nil, a.ID, data.Old, data.New)
	if errors.Is(err, passport.ErrUnauthorized()) {
		return ctx.Problem(cmfx.Unauthorized)
	} else if err != nil {
		return ctx.Error(err, "")
	}

	return l.user.Logout(ctx, nil, web.Phrase("change password"))
}

// # api get /securitylog 当前用户的安全操作记录
// @tag admin
// @query github.com/issue9/cmfx/cmfx/user.queryLog
// @resp 200 * github.com/issue9/cmfx/cmfx/query.Page[github.com/issue9/cmfx/cmfx/user.respLog]
func (l *Loader) getSecurityLogs(ctx *web.Context) web.Responser {
	return l.user.GetSecurityLogs(ctx)
}
