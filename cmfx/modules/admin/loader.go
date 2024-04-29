// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package admin 管理端的相关操作
package admin

import (
	"context"
	"errors"
	"time"

	"github.com/issue9/events"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/password"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

const (
	defaultPassword = "123"
	SystemID        = 0 // 表示系统的 ID
)

type Loader struct {
	user *user.Loader

	password  *password.Password
	roleGroup *rbac.RoleGroup

	// 用户登录和注销事件
	loginEvent  *events.Event[*user.User]
	logoutEvent *events.Event[*user.User]
}

// Load 声明 Admin 对象
//
// id 表示模块的 ID，在某些需要唯一值的地方，会加上此值作为前缀；
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
func Load(mod *cmfx.Module, o *user.Config) *Loader {
	loadProblems(mod.Server())

	u := user.Load(mod, o)

	auth := passport.New(mod, time.Minute*2)
	pass := password.New(mod)
	auth.Register("password", pass, web.StringPhrase("password mode"))
	m := &Loader{
		user: u,

		password: pass,

		loginEvent:  events.New[*user.User](),
		logoutEvent: events.New[*user.User](),
	}

	inst := rbac.New(mod, func(ctx *web.Context) (int64, web.Responser) {
		u := m.user.CurrentUser(ctx)
		if u == nil {
			return 0, ctx.Problem(web.ProblemUnauthorized)
		}
		return u.ID, nil
	})
	rg, err := inst.NewRoleGroup("0", SystemID)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	m.roleGroup = rg

	g := m.NewResourceGroup(mod)
	postGroup := g.New("post-roles", web.StringPhrase("post roles"))
	delGroup := g.New("delete-roles", web.StringPhrase("delete roles"))
	putGroup := g.New("put-roles", web.StringPhrase("edit roles"))
	putGroupResources := g.New("put-roles-resources", web.StringPhrase("put roles resources"))
	getAdmin := g.New("get-admin", web.StringPhrase("get admins"))
	putAdmin := g.New("put-admin", web.StringPhrase("put admin"))
	postAdmin := g.New("post-admin", web.StringPhrase("post admins"))
	delAdmin := g.New("del-admin", web.StringPhrase("delete admins"))

	mod.Router().Prefix(m.URLPrefix()).
		Post("/login", m.postLogin).
		Delete("/login", m.AuthFilter(m.deleteLogin)).
		Get("/token", m.AuthFilter(m.getToken))

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/resources", m.getResources).
		Get("/roles", m.getGroups).
		Post("/roles", postGroup(m.postGroups)).
		Put("/roles/{id:digit}", putGroup(m.putGroup)).
		Delete("/roles/{id:digit}", delGroup(m.deleteGroup)).
		Get("/roles/{id:digit}/resources", m.getGroupResources).
		Patch("/roles/{id:digit}/resources", putGroupResources(m.patchGroupResources))

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/info", m.getInfo).
		Patch("/info", m.patchInfo).
		Get("/securitylog", m.getSecurityLogs).
		Put("/password", m.putCurrentPassword)

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/admins", getAdmin(m.getAdmins)).
		Post("/admins", postAdmin(m.postAdmins)).
		Get("/admins/{id:digit}", getAdmin(m.getAdmin)).
		Patch("/admins/{id:digit}", putAdmin(m.patchAdmin)).
		Delete("/admins/{id:digit}/password", putAdmin(m.deleteAdminPassword)).
		Post("/admins/{id:digit}/locked", putAdmin(m.postAdminLocked)).
		Delete("/admins/{id:digit}/locked", putAdmin(m.deleteAdminLocked)).
		Delete("/admins/{id:digit}", delAdmin(m.deleteAdmin))

	return m
}

func (m *Loader) URLPrefix() string { return m.user.URLPrefix() }

// AuthFilter 验证是否登录
func (m *Loader) AuthFilter(next web.HandlerFunc) web.HandlerFunc {
	return m.user.Middleware(next)
}

// LoginUser 获取当前登录的用户信息
func (m *Loader) LoginUser(ctx *web.Context) *user.User { return m.user.CurrentUser(ctx) }

// NewResourceGroup 新建资源分组
func (m *Loader) NewResourceGroup(mod *cmfx.Module) *rbac.ResourceGroup {
	return m.roleGroup.RBAC().NewResourceGroup(mod.ID(), mod.Desc())
}

// GetResourceGroup 获取指定 ID 的资源分组
func (m *Loader) GetResourceGroup(id string) *rbac.ResourceGroup {
	return m.roleGroup.RBAC().ResourceGroup(id)
}

// ResourceGroup 当前资源组
func (m *Loader) ResourceGroup() *rbac.ResourceGroup { return m.GetResourceGroup(m.user.Module().ID()) }

func (m *Loader) AddSecurityLog(tx *orm.Tx, uid int64, content, ip, ua string) error {
	return m.user.AddSecurityLog(tx, uid, ip, ua, content)
}

func (m *Loader) AddSecurityLogWithContext(tx *orm.Tx, uid int64, ctx *web.Context, content string) {
	m.user.AddSecurityLogFromContext(tx, uid, ctx, content)
}

// OnLogin 注册登录事件
func (m *Loader) OnLogin(f func(*user.User)) context.CancelFunc {
	return m.loginEvent.Subscribe(f)
}

// OnLogout 注册用户主动退出时的事
func (m *Loader) OnLogout(f func(*user.User)) context.CancelFunc {
	return m.logoutEvent.Subscribe(f)
}

func newAdmin(mod *cmfx.Module, password *password.Password, data *respInfoWithAccount) error {
	tx, err := mod.DB().Begin()
	if err != nil {
		return err
	}

	e := tx.NewEngine(mod.DB().TablePrefix())

	id, err := e.LastInsertID(&user.User{NO: mod.Server().UniqueID()})
	if err != nil {
		return errors.Join(err, tx.Rollback())
	}

	a := &modelInfo{
		ID:       id,
		Nickname: data.Nickname,
		Name:     data.Name,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
	}
	if _, err = e.Insert(a); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if err := password.Add(tx, id, data.Username, data.Password); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	for _, role := range data.roles {
		if err := role.Link(id); err != nil {
			return err
		}
	}

	return nil
}

func (m *Loader) Module() *cmfx.Module { return m.user.Module() }
