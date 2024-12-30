// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"database/sql"
	"errors"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
)

// Module 不带权限功能的会员管理模块
type Module struct {
	user *user.Module
}

// Load 加载模块
func Load(mod *cmfx.Module, conf *Config, up *upload.Module, adminMod *admin.Module) *Module {
	m := &Module{
		user: user.Load(mod, conf.User),
	}

	resGroup := adminMod.NewResourceGroup(mod)
	getMembers := resGroup.New("get-members", web.StringPhrase("get members"))
	putMember := resGroup.New("put-member", web.StringPhrase("put member"))
	delMember := resGroup.New("del-member", web.StringPhrase("delete member"))

	ap := adminMod.UserModule().Module().Router().Prefix(adminMod.URLPrefix(), adminMod)
	adminAPI := adminMod.UserModule().Module().API
	ap.Get("/members", m.adminGetMembers, getMembers, adminAPI(func(o *openapi.Operation) {
		o.Tag("member").Desc(web.Phrase("get member list api"), nil).
			QueryObject(&adminQueryMembers{}, nil).
			Response200(query.Page[adminInfoVO]{})
	})).
		Get("/members/{id:digit}", m.adminGetMember, getMembers, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member info api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				Response200(&adminInfoVO{})
		})).
		Post("/members/{id:digit}/locked", m.adminPostMemberLock, putMember, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("lock the member api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				ResponseEmpty("201")
		})).
		Delete("/members/{id:digit}/locked", m.adminDeleteMemberLock, putMember, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("unlock the member api"), nil).ResponseEmpty("204")
		})).
		Delete("/members/{id:digit}", m.adminDeleteMember, delMember, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("delete the member api"), nil).ResponseEmpty("204")
		}))

	// 需要登录
	p := mod.Router().Prefix(m.URLPrefix(), m)
	up.Handle(p, mod.API, conf.Upload)
	p.
		Get("/info", m.memberGetInfo, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("get login user info api"), nil).
				Response200(memberInfoVO{})
		})).
		Patch("/info", m.memberPatchInfo, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("patch login user info api"), nil).
				Body(memberInfoTO{}, false, nil, nil).
				ResponseEmpty("204")
		}))

	// 不需要登录
	mod.Router().Prefix(m.URLPrefix()).
		Post("", m.memberRegister, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("register member api"), nil).
				Body(memberTO{}, false, nil, nil).
				ResponseEmpty("201")
		}))

	return m
}

func (m *Module) URLPrefix() string { return m.user.URLPrefix() }

// Middleware 验证是否登录
func (m *Module) Middleware(next web.HandlerFunc, method, path, router string) web.HandlerFunc {
	return m.user.Middleware(next, method, path, router)
}

// CurrentUser 获取当前登录的用户信息
func (m *Module) CurrentUser(ctx *web.Context) *user.User { return m.user.CurrentUser(ctx) }

// AddSecurityLog 记录一条安全日志
func (m *Module) AddSecurityLog(tx *orm.Tx, uid int64, content, ip, ua string) error {
	return m.UserModule().AddSecurityLog(tx, uid, ip, ua, content)
}

// AddSecurityLogWithContext 从 [web.Context] 中记录一条安全日志
func (m *Module) AddSecurityLogWithContext(tx *orm.Tx, uid int64, ctx *web.Context, content web.LocaleStringer) error {
	return m.UserModule().AddSecurityLogFromContext(tx, uid, ctx, content)
}

func (m *Module) UserModule() *user.Module { return m.user }

// NewMember 添加新的会员
func (m *Module) NewMember(data *memberTO, ip, ua, msg string) error {
	tx, err := m.user.Module().DB().Begin()
	if err != nil {
		return err
	}

	u, err := m.user.New(nil, user.StateNormal, data.Username, data.Password, ip, ua, msg)
	if err != nil {
		return errors.Join(err, tx.Rollback())
	}

	info := &infoPO{
		ID:       u.ID,
		Nickname: data.Username,
		Sex:      data.Sex,
		Avatar:   data.Avatar,
		Inviter:  data.inviter,
	}
	if !data.Birthday.IsZero() {
		info.Birthday = sql.NullTime{Valid: true, Time: data.Birthday}
	}

	if _, err = m.user.Module().DB().Insert(info); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	return tx.Commit()
}
