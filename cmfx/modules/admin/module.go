// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"context"
	"time"

	"github.com/issue9/events"
	"github.com/issue9/orm/v6"
	"github.com/issue9/upload/v3"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/handlers/static"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/password"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

type Module struct {
	user *user.Module

	password  passport.Adapter
	roleGroup *rbac.RoleGroup

	uploadField string

	// 用户登录和注销事件
	loginEvent  *events.Event[*user.User]
	logoutEvent *events.Event[*user.User]
}

// Load 加载管理模块
//
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
// saver 头像上传功能的保存方式；
func Load(mod *cmfx.Module, o *Config, saver upload.Saver) *Module {
	mod.Server().Use(web.PluginFunc(addProblems))

	u := user.Load(mod, o.User)

	pass := password.New(mod, 8)
	u.Passport().Register(passwordID, pass, web.StringPhrase("password mode"))
	m := &Module{
		user: u,

		password: pass,

		uploadField: o.Upload.Field,

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

	// 限制登录接口调用次数，可能存在 OPTIONS 等预检操作。
	loginRate := ratelimit.New(web.NewCache(mod.ID()+"_rate", mod.Server().Cache()), 20, time.Second, nil, nil)

	mod.Router().Prefix(m.URLPrefix()).
		Post("/login", m.postLogin, loginRate, initial.Unlimit(mod.Server())).
		Delete("/login", m.deleteLogin, m).
		Put("/login", m.putToken, m)

	mod.Router().Prefix(m.URLPrefix(), m).
		Get("/resources", m.getResources).
		Get("/roles", m.getRoles).
		Post("/roles", m.postRoles, postGroup).
		Put("/roles/{id:digit}", m.putRole, putGroup).
		Delete("/roles/{id:digit}", m.deleteRole, delGroup).
		Get("/roles/{id:digit}/resources", m.getRoleResources).
		Put("/roles/{id:digit}/resources", m.putRoleResources, putGroupResources)

	mod.Router().Prefix(m.URLPrefix(), m).
		Get("/info", m.getInfo).
		Patch("/info", m.patchInfo).
		Get("/securitylog", m.getSecurityLogs).
		Put("/password", m.putCurrentPassword)

	mod.Router().Prefix(m.URLPrefix(), m).
		Get("/admins", m.getAdmins, getAdmin).
		Post("/admins", m.postAdmins, postAdmin).
		Get("/admins/{id:digit}", m.getAdmin, getAdmin).
		Patch("/admins/{id:digit}", m.patchAdmin, putAdmin).
		Delete("/admins/{id:digit}/password", m.deleteAdminPassword, putAdmin).
		Post("/admins/{id:digit}/locked", m.postAdminLocked, putAdmin).
		Delete("/admins/{id:digit}/locked", m.deleteAdminLocked, putAdmin).
		Delete("/admins/{id:digit}", m.deleteAdmin, delAdmin)

	// upload
	up := upload.New(saver, o.Upload.Size, o.Upload.Exts...)
	mod.Router().Prefix(m.URLPrefix()).
		// # API GET /upload/{file} 获取上传的文件
		//
		// @tag admin upload
		// @path file 文件名
		// @resp 200 * []string
		Get("/upload/{file}", static.ServeFileHandler(up, "file", "index.html"))
	mod.Router().Prefix(m.URLPrefix(), m).
		// # API POST /upload 上传文件，文件的字段名可在配置文件中配置
		//
		// @tag admin upload
		// @resp 201 * {}
		Post("/upload", func(ctx *web.Context) web.Responser {
			files, err := up.Do(m.uploadField, ctx.Request())
			if err != nil {
				return ctx.Error(err, "")
			}
			return web.OK(files)
		})

	return m
}

func (m *Module) URLPrefix() string { return m.user.URLPrefix() }

// Middleware 验证是否登录
func (m *Module) Middleware(next web.HandlerFunc, method, path, router string) web.HandlerFunc {
	return m.user.Middleware(next, method, path, router)
}

// CurrentUser 获取当前登录的用户信息
func (m *Module) CurrentUser(ctx *web.Context) *user.User { return m.user.CurrentUser(ctx) }

// NewResourceGroup 以模块为单位创建资源分组
func (m *Module) NewResourceGroup(mod *cmfx.Module) *rbac.ResourceGroup {
	return m.roleGroup.RBAC().NewResourceGroup(mod.ID(), mod.Desc())
}

// GetResourceGroup 获取指定模块的资源分组
func (m *Module) GetResourceGroup(mod *cmfx.Module) *rbac.ResourceGroup {
	return m.roleGroup.RBAC().ResourceGroup(mod.ID())
}

// ResourceGroup 管理模块的资源分组
func (m *Module) ResourceGroup() *rbac.ResourceGroup { return m.GetResourceGroup(m.user.Module()) }

// AddSecurityLog 记录一条安全日志
func (m *Module) AddSecurityLog(tx *orm.Tx, uid int64, content, ip, ua string) error {
	return m.user.AddSecurityLog(tx, uid, ip, ua, content)
}

// AddSecurityLogWithContext 从 [web.Context] 中记录一条安全日志
func (m *Module) AddSecurityLogWithContext(tx *orm.Tx, uid int64, ctx *web.Context, content web.LocaleStringer) error {
	return m.user.AddSecurityLogFromContext(tx, uid, ctx, content)
}

// OnLogin 注册登录事件
func (m *Module) OnLogin(f func(*user.User)) context.CancelFunc { return m.loginEvent.Subscribe(f) }

// OnLogout 注册用户主动退出时的事
func (m *Module) OnLogout(f func(*user.User)) context.CancelFunc { return m.logoutEvent.Subscribe(f) }

func (m *Module) Module() *cmfx.Module { return m.user.Module() }

func (m *Module) Passport() *passport.Passport { return m.user.Passport() }

// 手动添加一个新的管理员
func (m *Module) newAdmin(pa passport.Adapter, data *reqInfoWithAccount, now time.Time) error {
	uid, err := m.user.NewUser(pa, data.Username, data.Password, now)
	if err != nil {
		return err
	}

	a := &info{
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
