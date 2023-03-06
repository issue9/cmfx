// SPDX-License-Identifier: MIT

// Package admin 管理端的相关操作
package admin

import (
	"net/http"
	"time"

	"github.com/issue9/events"
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/types"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/authenticator/password"
	"github.com/issue9/cmfx/pkg/config"
	"github.com/issue9/cmfx/pkg/rbac"
	"github.com/issue9/cmfx/pkg/securitylog"
	"github.com/issue9/cmfx/pkg/token"
)

const (
	adminKey contextKey = 0

	// defaultPassword 默认密码
	defaultPassword = "123" // TODO 移至数据库？

	authPasswordType = "login"

	// SystemID 表示系统的 ID
	SystemID = 0

	// 当前模块的资源分组 ID
	ResourceID = "admin"
)

type contextKey int

type Admin struct {
	db       *orm.DB
	dbPrefix orm.Prefix

	urlPrefix string
	router    *web.Router

	auth        *authenticator.Authenticators
	password    *password.Password
	tokenServer *token.Tokens[*claims]
	rbac        *rbac.RBAC

	securitylog *securitylog.SecurityLog

	// 用户登录和注销事件
	loginEvent  events.Eventer[int64]
	logoutEvent events.Eventer[int64]
}

// New 声明 Admin 对象
//
// id 表示模块的 ID，在某些需要唯一值的地方，会加上此值作为前缀；
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
func New(id string, s *web.Server, db *orm.DB, router *web.Router, o *config.User) (*Admin, error) {
	loadOnce(s)

	inst, err := rbac.New(s, id, db)
	if err != nil {
		return nil, web.NewStackError(err)
	}

	tks, err := config.NewTokens(o, s, id, db, buildClaims, web.Phrase("token gc"))
	if err != nil {
		return nil, err
	}

	auth := authenticator.NewAuthenticators(s, time.Minute*2, web.Phrase("auth id gc"))
	pass := password.New(s, orm.Prefix(id+"_"+authPasswordType), db)
	auth.Register(authPasswordType, pass, web.Phrase("password mode"))
	m := &Admin{
		db:       db,
		dbPrefix: orm.Prefix(id),

		urlPrefix: o.URLPrefix,
		router:    router,

		auth:        auth,
		password:    pass,
		tokenServer: tks,
		rbac:        inst,

		securitylog: securitylog.New(id, db),

		loginEvent:  events.New[int64](),
		logoutEvent: events.New[int64](),
	}

	g := m.NewResourceGroup(ResourceID, web.Phrase("admin resource"))
	g.AddResources(map[string]web.LocaleStringer{
		"post-group":          web.Phrase("post groups"),
		"delete-group":        web.Phrase("delete groups"),
		"put-group":           web.Phrase("edit groups"),
		"put-group-resources": web.Phrase("put groups resources"),

		"get-admin":  web.Phrase("get admins"),
		"put-admin":  web.Phrase("put admin"),
		"post-admin": web.Phrase("post admins"),
	})

	router.Prefix(m.URLPrefix()).
		Post("/login", m.postLogin).
		Delete("/login", m.AuthFilter(m.deleteLogin)).
		Get("/token", m.AuthFilter(m.getToken))

	router.Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/resources", m.getResources).
		Get("/groups", m.getGroups).
		Post("/groups", m.RBACFilter(id, "post-group", m.postGroups)).
		Put("/groups/{id:digit}", m.RBACFilter(id, "put-group", m.putGroup)).
		Delete("/groups/{id:digit}", m.RBACFilter(id, "delete-group", m.deleteGroup)).
		Get("/groups/{id:digit}/resources", m.getGroupResources).
		Get("/groups/{id:digit}/resources/allowed", m.getGroupAllowedResources).
		Patch("/groups/{id:digit}/resources", m.RBACFilter(id, "put-group-resources", m.patchGroupResources))

	router.Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Get("/info", m.getInfo).
		Patch("/info", m.patchInfo).
		Get("/securitylog", m.getSecurityLogs).
		Put("/password", m.putCurrentPassword)

	router.Prefix(m.URLPrefix(), web.MiddlewareFunc(m.AuthFilter)).
		Post("/admins/{id:digit}/super", m.postSuper).
		Get("/admins", m.RBACFilter(id, "get-admin", m.getAdmins)).
		Post("/admins", m.RBACFilter(id, "post-admin", m.postAdmins)).
		Get("/admins/{id:digit}", m.RBACFilter(id, "get-admin", m.getAdmin)).
		Patch("/admins/{id:digit}", m.RBACFilter(id, "put-admin", m.patchAdmin)).
		Delete("/admins/{id:digit}/password", m.RBACFilter(id, "put-admin", m.deleteAdminPassword)).
		Post("/admins/{id:digit}/locked", m.RBACFilter(id, "put-admin", m.postAdminLocked)).
		Delete("/admins/{id:digit}/locked", m.RBACFilter(id, "put-admin", m.deleteAdminLocked)).
		Post("/admins/{id:digit}/left", m.RBACFilter(id, "put-admin", m.postAdminLeft)).
		Delete("/admins/{id:digit}/left", m.RBACFilter(id, "put-admin", m.deleteAdminLeft))

	return m, nil
}

func (m *Admin) URLPrefix() string { return m.urlPrefix }

// AuthFilter 验证是否登录
//
// 同时如果在登录状态下，会将当前登录用户的数据写入 ctx.Vars。
func (m *Admin) AuthFilter(next web.HandlerFunc) web.HandlerFunc {
	return m.tokenServer.Middleware(func(ctx *web.Context) web.Responser {
		c, found := m.tokenServer.GetValue(ctx)
		if !found {
			return web.Status(http.StatusUnauthorized)
		}
		ctx.SetVar(adminKey, c.UID)
		return next(ctx)
	})
}

// LoginUser 获取当前登录的用户信息
//
// 该信息由 AuthFilter 存储在 ctx.Vars 之中。
func (m *Admin) LoginUser(ctx *web.Context) *ModelAdmin {
	uid, found := ctx.GetVar(adminKey)
	if !found {
		ctx.Server().Logs().ERROR().String("未检测到登录用户，可能是该接口未调用 admin.AuthFilter 中间件造成的！")
		return nil
	}
	a := &ModelAdmin{ID: uid.(int64)}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if !found {
		ctx.Server().Logs().ERROR().String("未检测到登录用户，可能是该接口未调用 admin.AuthFilter 中间件造成的！")
		return nil
	}
	if err != nil {
		ctx.Server().Logs().ERROR().Error(err)
		return nil
	}

	return a
}

// NewResourceGroup 新建资源分组
func (m *Admin) NewResourceGroup(id string, desc web.LocaleStringer) *rbac.Group {
	return m.rbac.NewGroup(id, desc)
}

// GetResourceGroup 获取已有资源分组
func (m *Admin) GetResourceGroup(id string) *rbac.Group { return m.rbac.Group(id) }

// RBACFilter 验证是否拥有指定的权限
//
// NOTE: 需要 [Admin.AuthFilter] 作为前置条件，用到了其产生的 "admin" 变量。
func (m *Admin) RBACFilter(mod string, res string, next web.HandlerFunc) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		u := m.LoginUser(ctx)
		if u == nil {
			return ctx.Problem(cmfx.Unauthorized)
		}

		if u.Super {
			return next(ctx)
		}
		return m.rbac.Filter(u.ID, mod, res, next)(ctx)
	}
}

// IsAllowChangeGroup 是否允许当前登录用户将角色 groups 赋予其它用户
//
// 除超级用户之外，其它任何人只能应用自己当前角色或是子角色给其它用户。
func (m *Admin) IsAllowChangeGroup(ctx *web.Context, groups types.SliceOf[int64]) (bool, error) {
	curr := m.LoginUser(ctx)
	if curr.Super {
		return true, nil
	}
	return m.rbac.IsAllowRoles(curr.ID, groups)
}

func (m *Admin) AddSecurityLog(uid int64, content, ip, ua string) error {
	return m.securitylog.Add(uid, ip, ua, content)
}

func (m *Admin) AddSecurityLogWithContext(uid int64, ctx *web.Context, content string) {
	if err := m.securitylog.AddWithContext(uid, ctx, content); err != nil {
		ctx.Server().Logs().ERROR().Error(err)
	}
}

func (m *Admin) OnLogin(f func(int64)) (int, error) { return m.loginEvent.Attach(f) }

func (m *Admin) OnLogout(f func(int64)) (int, error) { return m.logoutEvent.Attach(f) }
