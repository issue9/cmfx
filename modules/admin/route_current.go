// SPDX-License-Identifier: MIT

package admin

import (
    "errors"

    "github.com/issue9/web"

    "github.com/issue9/cmfx"
    "github.com/issue9/cmfx/pkg/passport"
    "github.com/issue9/cmfx/pkg/rules"
)

// <api method="GET" summary="获取当前登用户的信息">
//
//	<path path="/info" />
//	<server>admin</server>
//	<tag>admin</tag>
//	<response status="200" type="object">
//	    <param name="id" type="number" summary="用户 ID" />
//	    <param name="username" type="string" summary="登录账号" />
//	    <param name="state" type="string" summary="状态值">
//	        <enum value="normal" summary="正常" />
//	        <enum value="locked" summary="锁定" />
//	        <enum value="left" summary="离职" />
//	    </param>
//	    <param name="name" type="string" summary="真实姓名" />
//	    <param name="nickname" type="string" summary="姓名" />
//	</response>
//
// </api>
func (m *Admin) getInfo(ctx *web.Context) web.Responser {
    return web.OK(m.LoginUser(ctx))
}

type info struct {
    XMLName  struct{} `json:"-" xml:"info"`
    Nickname string   `json:"nickname" xml:"nickname"`
    Avatar   string   `json:"avatar" xml:"avatar"`
}

func (i *info) CTXSanitize(ctx *web.Context, v *web.Validation) {
    v.AddField(i.Nickname, "nickname", rules.Required).
        AddField(i.Avatar, "avatar", rules.Avatar)
}

// <api method="patch" summary="更新当前登用户的信息">
//
//	<server>admin</server>
//	<tag>admin</tag>
//	<path path="/info" />
//	<request type="object">
//	    <header name="Authorization" type="string" summary="登录凭证 token" />
//	     <param name="nickname" type="string" summary="昵称" />
//	     <param name="avatar" type="string" summary="头像" />
//	</request>
//	<response status="204" summary="修改成功" />
//
// </api>
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

type password struct {
    XMLName struct{} `json:"-" xml:"password"`
    Old     string   `json:"old" xml:"old"`
    New     string   `json:"new" xml:"new"`
}

func (p *password) CTXSanitize(ctx *web.Context, v *web.Validation) {
    v.AddField(p.Old, "old", rules.Required).
        AddField(p.New, "new", rules.Required).
        AddField(p.New, "new", web.NewRuleFunc(web.Phrase("same of new and old password"), func(any) bool {
            return p.Old == p.New
        }))
}

// <api method="PUT" summary="当前登录用户修改自己的密码">
//
//	<server>admin</server>
//	<tag>auth</tag>
//	<tag>admin</tag>
//	<path path="/password" />
//	<request type="object">
//	    <param name="old" type="string" summary="旧密码" />
//	    <param name="new" type="string" summary="新密码" />
//	</request>
//	<response status="204" />
//
// </api>
func (m *Admin) putCurrentPassword(ctx *web.Context) web.Responser {
    data := &password{}
    if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
        return resp
    }

    a := m.LoginUser(ctx)
    err := m.password.Change(nil, a.ID, data.Old, data.New)
    if errors.Is(err, passport.ErrUnauthorized) {
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

// <api method="GET" summary="当前用户的安全操作记录">
//
//	<path path="/securitylog">
//	    <query name="size" type="number" default="20" summary="每页数量" />
//	    <query name="page" type="number" default="0" summary="页码，起始页 0" />
//	    <query name="text" type="string" summary="搜索文本内容" />
//	    <query name="created" type="string" summary="时间" />
//	</path>
//	<response status="200" type="object">
//	    <param name="count" type="number" summary="总数量" />
//	    <param name="logs" type="object" summary="当前页的数据">
//	        <param name="content" type="string" summary="操作内容" />
//	        <param name="ip" type="string" summary="ip" />
//	        <param name="ua" type="string" summary="user agent" />
//	        <param name="created" type="string.date-time" summary="操作时间" />
//	    </param>
//	</response>
//
// </api>
func (m *Admin) getSecurityLogs(ctx *web.Context) web.Responser {
    if u := m.LoginUser(ctx); u != nil {
        return m.securitylog.GetHandle(u.ID, ctx)
    }
    return ctx.Problem(cmfx.Unauthorized)
}
