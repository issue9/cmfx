// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package admin 管理端的相关操作
package admin

import (
	"context"
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
	passwordID      = "password"
	defaultPassword = "123"
)

type Module struct {
	user *user.Module

	password  passport.Adapter
	roleGroup *rbac.RoleGroup

	// 用户登录和注销事件
	loginEvent  *events.Event[*user.User]
	logoutEvent *events.Event[*user.User]
}

// Load 声明 Admin 对象
//
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
func Load(mod *cmfx.Module, o *Config) *Module {
	loadProblems(mod.Server())

	u := user.Load(mod, o.User)

	pass := password.New(mod, 8)
	u.Passport().Register(passwordID, pass, web.StringPhrase("password mode"))
	m := &Module{
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
	rg, err := inst.NewRoleGroup("0", o.SuperUser)
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
		Delete("/login", m.Middleware(m.deleteLogin)).
		Put("/login", m.Middleware(m.getToken))

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.Middleware)).
		Get("/resources", m.getResources).
		Get("/roles", m.getRoles).
		Post("/roles", postGroup(m.postRoles)).
		Put("/roles/{id:digit}", putGroup(m.putRole)).
		Delete("/roles/{id:digit}", delGroup(m.deleteRole)).
		Get("/roles/{id:digit}/resources", m.getRoleResources).
		Put("/roles/{id:digit}/resources", putGroupResources(m.putRoleResources))

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.Middleware)).
		Get("/info", m.getInfo).
		Patch("/info", m.patchInfo).
		Get("/securitylog", m.getSecurityLogs).
		Put("/password", m.putCurrentPassword)

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.Middleware)).
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

func (m *Module) URLPrefix() string { return m.user.URLPrefix() }

// Middleware 验证是否登录
func (m *Module) Middleware(next web.HandlerFunc) web.HandlerFunc { return m.user.Middleware(next) }

// CurrentUser 获取当前登录的用户信息
func (m *Module) CurrentUser(ctx *web.Context) *user.User { return m.user.CurrentUser(ctx) }

// NewResourceGroup 新建资源分组
func (m *Module) NewResourceGroup(mod *cmfx.Module) *rbac.ResourceGroup {
	return m.roleGroup.RBAC().NewResourceGroup(mod.ID(), mod.Desc())
}

// GetResourceGroup 获取指定 ID 的资源分组
func (m *Module) GetResourceGroup(id string) *rbac.ResourceGroup {
	return m.roleGroup.RBAC().ResourceGroup(id)
}

// ResourceGroup 当前资源组
func (m *Module) ResourceGroup() *rbac.ResourceGroup { return m.GetResourceGroup(m.user.Module().ID()) }

func (m *Module) AddSecurityLog(tx *orm.Tx, uid int64, content, ip, ua string) error {
	return m.user.AddSecurityLog(tx, uid, ip, ua, content)
}

func (m *Module) AddSecurityLogWithContext(tx *orm.Tx, uid int64, ctx *web.Context, content string) error {
	return m.user.AddSecurityLogFromContext(tx, uid, ctx, content)
}

// OnLogin 注册登录事件
func (m *Module) OnLogin(f func(*user.User)) context.CancelFunc { return m.loginEvent.Subscribe(f) }

// OnLogout 注册用户主动退出时的事
func (m *Module) OnLogout(f func(*user.User)) context.CancelFunc { return m.logoutEvent.Subscribe(f) }

func (m *Module) Module() *cmfx.Module { return m.user.Module() }

// 手动添加一个新的管理员
func (m *Module) newAdmin(pa passport.Adapter, data *respInfoWithAccount, now time.Time) error {
	uid, err := m.user.NewUser(pa, data.Username, data.Password, now)
	if err != nil {
		return err
	}

	a := &modelInfo{
		ID:       uid,
		Nickname: data.Nickname,
		Name:     data.Name,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
	}
	if _, err = m.Module().DB().Insert(a); err != nil {
		return err
	}

	for _, role := range data.roles {
		if err := role.Link(uid); err != nil {
			return err
		}
	}

	return nil
}

func (m *Module) newRole(name, desc, parent string) (*rbac.Role, error) {
	return m.roleGroup.NewRole(name, desc, parent)
}
