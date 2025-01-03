// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"database/sql"
	"errors"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
	"github.com/issue9/cmfx/cmfx/user"
)

// Module 不带权限功能的会员管理模块
type Module struct {
	user  *user.Module
	admin *admin.Module

	levels *tag.Module
	types  *tag.Module
}

// Load 加载模块
func Load(mod *cmfx.Module, conf *Config, up *upload.Module, adminMod *admin.Module) *Module {
	m := &Module{
		user:  user.Load(mod, conf.User),
		admin: adminMod,

		levels: tag.Load(mod, levelsTableName),
		types:  tag.Load(mod, typesTableName),
	}

	resGroup := adminMod.NewResourceGroup(mod)
	addMembers := resGroup.New("add-members", web.StringPhrase("add members"))
	getMembers := resGroup.New("get-members", web.StringPhrase("get members"))
	putMember := resGroup.New("put-member", web.StringPhrase("put member"))
	delMember := resGroup.New("del-member", web.StringPhrase("delete member"))

	// admin 接口

	ap := adminMod.UserModule().Module().Router().Prefix(adminMod.URLPrefix(), adminMod)
	adminAPI := adminMod.UserModule().Module().API
	ap.
		Post("/members", m.adminPostMembers, addMembers, adminAPI(func(o *openapi.Operation) {
			o.Tag("/member").Desc(web.Phrase("add member api"), nil).
				Body(adminInfoTO{}, false, nil, nil).
				ResponseEmpty("201")
		})).
		Get("/members", m.adminGetMembers, getMembers, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member list api"), nil).
				QueryObject(&adminQueryMembers{}, nil).
				Response200(query.Page[adminInfoVO]{})
		})).
		Get("/members/{id:digit}", m.adminGetMember, getMembers, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member info api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				Response200(&adminInfoVO{})
		})).
		Get("/members/{id:digit}/invited", m.adminGetMemberInvited, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member invited api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				QueryObject(&invitedQuery{}, nil).
				Response200(query.Page[InvitedMember]{})
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
		})).
		Get("/member/levels", m.levels.HandleGetTags, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member level list api"), nil).Response200([]tag.TagPO{})
		})).
		Put("/member/levels/{id:digit}", m.adminPutLevel, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").
				Desc(web.Phrase("patch member level api"), nil).
				Body(tag.TagTO{}, false, nil, nil).
				PathID("id:digit", web.Phrase("the ID of member level"))
		})).
		Post("/member/levels", m.levels.HandlePostTags, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").
				Desc(web.Phrase("add member level api"), nil).
				Body(tag.TagTO{}, false, nil, nil)
		})).
		Get("/member/types", m.types.HandleGetTags, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member type list api"), nil).Response200([]tag.TagPO{})
		})).
		Put("/member/types/{id:digit}", m.adminPutType, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").
				Desc(web.Phrase("patch member type api"), nil).
				Body(tag.TagTO{}, false, nil, nil).
				PathID("id:digit", web.Phrase("the ID of member type"))
		})).
		Post("/member/types", m.types.HandlePostTags, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").
				Desc(web.Phrase("add member type api"), nil).
				Body(tag.TagTO{}, false, nil, nil)
		}))

	// member 接口

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
		})).
		Get("/invited", m.memberGetMemberInvited, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member invited api"), nil).
				QueryObject(&invitedQuery{}, nil).
				Response200(query.Page[InvitedMember]{})
		})).
		Get("/levels", m.levels.HandleGetTags, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member level list api"), nil).Response200([]tag.TagPO{})
		})).
		Get("/types", m.types.HandleGetTags, adminAPI(func(o *openapi.Operation) {
			o.Tag("member").Desc(web.Phrase("get member type list api"), nil).Response200([]tag.TagPO{})
		}))

	// 不需要登录
	mod.Router().Prefix(m.URLPrefix()).
		Post("", m.memberRegister, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("register member api"), nil).
				Body(memberInfoTO{}, false, nil, nil).
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

type RegisterInfo struct {
	Username string
	Password string
	Birthday time.Time
	Sex      types.Sex
	Nickname string
	Avatar   string
	Level    int64
	Type     int64
	Inviter  int64
}

// Add 添加新的会员
func (m *Module) Add(state user.State, data *RegisterInfo, ip, ua, msg string) (*user.User, error) {
	tx, err := m.user.Module().DB().Begin()
	if err != nil {
		return nil, err
	}

	u, err := m.user.New(tx, state, data.Username, data.Password, ip, ua, msg)
	if err != nil {
		return nil, errors.Join(err, tx.Rollback())
	}

	info := &infoPO{
		ID:       u.ID,
		Nickname: data.Username,
		Sex:      data.Sex,
		Avatar:   data.Avatar,
		Inviter:  data.Inviter,
	}
	if !data.Birthday.IsZero() {
		info.Birthday = sql.NullTime{Valid: true, Time: data.Birthday}
	}

	if _, err = m.UserModule().Module().Engine(tx).Insert(info); err != nil {
		return nil, errors.Join(err, tx.Rollback())
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return u, nil
}

type invitedQuery struct {
	query.Text
	State []user.State `query:"state,normal"`
}

func (q *invitedQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
	ctx.Add(user.StateSliceFilter("state", &q.State))
}

// Invited 返回所有被 uid 邀请的用户列表
//
// 如果查找不到数据，则会同时返回两个 nil
func (m *Module) Invited(uid int64, q *invitedQuery) (*query.Page[InvitedMember], error) {
	sql := m.user.Module().DB().SQLBuilder().Select().
		From(orm.TableName(&infoPO{}), "info").
		Where("info.inviter=?", uid).
		Column("info.*")

	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("u.username LIKE ? OR u.no LIKE ? OR info.nickname LIKE ?", txt, txt, txt)
	}

	m.user.LeftJoin(sql, "u", "u.{id}=info.{id}", q.State)

	type mod struct {
		infoPO
		NO       string     `orm:"name(no);len(32);unique(no)"`
		Username string     `orm:"name(username);len(32)"`
		State    user.State `orm:"name(state)"`
	}

	return query.PagingWithConvert(&q.Limit, sql, func(t *mod) *InvitedMember {
		m := &InvitedMember{
			ID:       t.ID,
			NO:       t.NO,
			Username: t.Username,
			Inviter:  t.Inviter,
			Sex:      t.Sex,
			Nickname: t.Nickname,
			Level:    t.Level,
			Type:     t.Type,
			Avatar:   t.Avatar,
		}

		if t.Birthday.Valid {
			m.Birthday = t.Birthday.Time
		}

		return m
	})
}

type InvitedMember struct {
	XMLName struct{} `json:"-" cbor:"-" yaml:"-" xml:"member"`

	ID       int64     `json:"id,omitempty" yaml:"id,omitempty" xml:"id,attr,omitempty" cbor:"id,omitempty" comment:"id"`
	NO       string    `json:"no" xml:"no" cbor:"no" yaml:"no" comment:"user no"`
	Username string    `json:"username" yaml:"username" xml:"username" cbor:"username" comment:"username"`
	Inviter  int64     `json:"inviter,omitempty" yaml:"inviter,omitempty" xml:"inviter,omitempty" cbor:"inviter,omitempty" comment:"inviter"`
	Birthday time.Time `json:"birthday,omitempty" yaml:"birthday,omitempty" cbor:"birthday,omitempty" xml:"birthday,omitempty" comment:"birthday"`
	Sex      types.Sex `json:"sex,omitempty" xml:"sex,attr,omitempty" cbor:"sex,omitempty" yaml:"sex,omitempty" comment:"sex"`
	Nickname string    `json:"nickname,omitempty" xml:"nickname,omitempty" cbor:"nickname,omitempty" yaml:"nickname,omitempty" comment:"nickname"`
	Avatar   string    `json:"avatar,omitempty" xml:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty" comment:"avatar"`
	Level    int64     `json:"level,omitempty" yaml:"level,omitempty" xml:"level,attr,omitempty" cbor:"level,omitempty"`
	Type     int64     `json:"type,omitempty" yaml:"type,omitempty" xml:"type,attr,omitempty" cbor:"type,omitempty"`
}
