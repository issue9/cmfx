// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package admin 管理端的相关操作
package admin

import (
	"errors"
	"time"

	"github.com/issue9/events"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/authenticator/password"
	"github.com/issue9/cmfx/pkg/db"
	"github.com/issue9/cmfx/pkg/rbac"
	"github.com/issue9/cmfx/pkg/user"
)

const (
	defaultPassword = "123"

	authPasswordType = "login"

	SystemID = 0 // 表示系统的 ID
)

type Admin struct {
	user *user.Module

	password *password.Password
	rbac     *rbac.RBAC

	// 用户登录和注销事件
	loginEvent  events.Eventer[int64]
	logoutEvent events.Eventer[int64]
}

// New 声明 Admin 对象
//
// id 表示模块的 ID，在某些需要唯一值的地方，会加上此值作为前缀；
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
func New(mod cmfx.Module, o *user.Config) (*Admin, error) {
	loadProblems(mod.Server())

	inst, err := rbac.New(mod)
	if err != nil {
		return nil, web.NewStackError(err)
	}

	u, err := user.NewModule(mod, o)
	if err != nil {
		return nil, err
	}

	auth := authenticator.NewAuthenticators(mod.Server(), time.Minute*2, web.StringPhrase("auth id gc"))
	pass := password.New(mod.New("_"+authPasswordType, web.Phrase("password module")))
	auth.Register(authPasswordType, pass, web.StringPhrase("password mode"))
	m := &Admin{
		user: u,

		password: pass,
		rbac:     inst,

		loginEvent:  events.New[int64](),
		logoutEvent: events.New[int64](),
	}

	g := m.NewResourceGroup(mod)
	postGroup := g.NewResource("post-group", web.StringPhrase("post groups"))
	delGroup := g.NewResource("delete-group", web.StringPhrase("delete groups"))
	putGroup := g.NewResource("put-group", web.StringPhrase("edit groups"))
	putGroupResources := g.NewResource("put-group-resources", web.StringPhrase("put groups resources"))
	getAdmin := g.NewResource("get-admin", web.StringPhrase("get admins"))
	putAdmin := g.NewResource("put-admin", web.StringPhrase("put admin"))
	postAdmin := g.NewResource("post-admin", web.StringPhrase("post admins"))
	delAdmin := g.NewResource("del-admin", web.StringPhrase("delete admins"))

	mod.Router().Prefix(m.URLPrefix()).
		Post("/login", m.postLogin).
		Delete("/login", m.AuthFilter(m.deleteLogin)).
		Get("/token", m.AuthFilter(m.getToken))

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/resources", m.getResources).
		Get("/groups", m.getGroups).
		Post("/groups", m.RBACFilter(postGroup, m.postGroups)).
		Put("/groups/{id:digit}", m.RBACFilter(putGroup, m.putGroup)).
		Delete("/groups/{id:digit}", m.RBACFilter(delGroup, m.deleteGroup)).
		Get("/groups/{id:digit}/resources", m.getGroupResources).
		Get("/groups/{id:digit}/resources/allowed", m.getGroupAllowedResources).
		Patch("/groups/{id:digit}/resources", m.RBACFilter(putGroupResources, m.patchGroupResources))

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/info", m.getInfo).
		Patch("/info", m.patchInfo).
		Get("/securitylog", m.getSecurityLogs).
		Put("/password", m.putCurrentPassword)

	mod.Router().Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Post("/admins/{id:digit}/super", m.postSuper).
		Get("/admins", m.RBACFilter(getAdmin, m.getAdmins)).
		Post("/admins", m.RBACFilter(postAdmin, m.postAdmins)).
		Get("/admins/{id:digit}", m.RBACFilter(getAdmin, m.getAdmin)).
		Patch("/admins/{id:digit}", m.RBACFilter(putAdmin, m.patchAdmin)).
		Delete("/admins/{id:digit}/password", m.RBACFilter(putAdmin, m.deleteAdminPassword)).
		Post("/admins/{id:digit}/locked", m.RBACFilter(putAdmin, m.postAdminLocked)).
		Delete("/admins/{id:digit}/locked", m.RBACFilter(putAdmin, m.deleteAdminLocked)).
		Delete("/admins/{id:digit}", m.RBACFilter(delAdmin, m.deleteAdmin))

	return m, nil
}

func (m *Admin) URLPrefix() string { return m.user.URLPrefix() }

// AuthFilter 验证是否登录
func (m *Admin) AuthFilter(next web.HandlerFunc) web.HandlerFunc {
	return m.user.AuthFilter(next)
}

// LoginUser 获取当前登录的用户信息
func (m *Admin) LoginUser(ctx *web.Context) *user.User { return m.user.LoginUser(ctx) }

// NewResourceGroup 新建资源分组
func (m *Admin) NewResourceGroup(mod cmfx.Module) *rbac.Group {
	return m.rbac.NewGroup(mod.ID(), mod.Desc())
}

// GetResourceGroup 获取指定 ID 的资源分组
func (m *Admin) GetResourceGroup(id string) *rbac.Group { return m.rbac.Group(id) }

// ResourceGroup 当前资源组
func (m *Admin) ResourceGroup() *rbac.Group { return m.GetResourceGroup(m.user.ID()) }

// RBACFilter 验证是否拥有指定的权限
//
// res 资源的 ID，为 [rbac.Group.NewResource] 的返回值；
//
// NOTE: 需要 [Admin.AuthFilter] 作为前置条件。
func (m *Admin) RBACFilter(res string, next web.HandlerFunc) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		u := m.LoginUser(ctx)
		if u == nil {
			return ctx.Problem(cmfx.Unauthorized)
		}

		return m.rbac.Filter(u.ID, res, next)(ctx)
	}
}

// IsAllowChangeRole 是否允许当前登录用户将角色赋予其它用户
//
// 除超级用户之外，其它任何人只能应用自己当前角色或是子角色给其它用户。
func (m *Admin) IsAllowChangeRole(ctx *web.Context, roles db.Int64s) (bool, error) {
	curr := m.LoginUser(ctx)
	return m.rbac.IsAllowRoles(curr.ID, roles)
}

func (m *Admin) AddSecurityLog(tx *db.Tx, uid int64, content, ip, ua string) error {
	return m.user.AddSecurityLog(tx, uid, ip, ua, content)
}

func (m *Admin) AddSecurityLogWithContext(tx *db.Tx, uid int64, ctx *web.Context, content string) {
	m.user.AddSecurityLogFromContext(tx, uid, ctx, content)
}

// OnLogin 注册登录事件
func (m *Admin) OnLogin(f func(int64)) (int, error) { return m.loginEvent.Attach(f) }

// OnLogout 注册用户主动退出时的事
func (m *Admin) OnLogout(f func(int64)) (int, error) { return m.logoutEvent.Attach(f) }

func newAdmin(mod cmfx.Module, rbac *rbac.RBAC, password *password.Password, data *respInfoWithAccount) error {
	tx, err := mod.DB().Begin()
	if err != nil {
		return err
	}

	id, err := mod.DBEngine(tx).LastInsertID(&user.User{NO: mod.Server().UniqueID()})
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
	if _, err = mod.DBEngine(tx).Insert(a); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if err := rbac.Link(tx, id, data.Roles...); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if err := password.Add(tx, id, data.Username, data.Password); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
