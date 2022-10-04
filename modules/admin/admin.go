// SPDX-License-Identifier: MIT

// Package admin 管理端的相关操作
package admin

import (
	"net/http"

	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/types"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/passport"
	"github.com/issue9/cmfx/pkg/rbac"
	"github.com/issue9/cmfx/pkg/securitylog"
	"github.com/issue9/cmfx/pkg/token"
)

const (
	adminKey contextKey = 0

	// defaultPassword 默认密码
	defaultPassword = "123"

	authPasswordType = "login"

	// SystemID 表示系统的 ID
	SystemID = 0
)

type contextKey int

type Admin struct {
	db       *orm.DB
	dbPrefix orm.Prefix

	urlPrefix string
	router    *web.Router

	password    *passport.Password
	tokenServer *token.Tokens[*claims]
	rbac        *rbac.RBAC

	securitylog *securitylog.SecurityLog
}

func New(id string, s *web.Server, db *orm.DB, urlPrefix string, tokenCfg *token.Config, router *web.Router) (*Admin, error) {
	loadOnce(s)

	inst, err := rbac.New(id, db, nil) // TODO 第三个参数写配置文件
	if err != nil {
		return nil, web.StackError(err)
	}

	tks, err := token.NewTokens(id, s, db, buildClaims, tokenCfg, "回收丢弃的管理员令牌")
	if err != nil {
		return nil, err
	}

	m := &Admin{
		db:       db,
		dbPrefix: orm.Prefix(id),

		urlPrefix: urlPrefix,
		router:    router,

		password:    passport.New(id, db).Password(id + "_" + authPasswordType),
		tokenServer: tks,
		rbac:        inst,

		securitylog: securitylog.New(id, db),
	}

	err = m.RegisterResources(id, map[string]web.LocaleStringer{
		"post-group":          web.Phrase("post groups"),
		"delete-group":        web.Phrase("delete groups"),
		"put-group":           web.Phrase("edit groups"),
		"put-group-resources": web.Phrase("put groups resources"),

		"get-admin":  web.Phrase("get admins"),
		"put-admin":  web.Phrase("put admin"),
		"post-admin": web.Phrase("post admins"),
	})
	if err != nil {
		return nil, web.StackError(err)
	}

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
		Put("/password", m.putCurrentPassword).
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
		ctx.Vars[adminKey] = c.UID
		return next(ctx)
	})
}

// LoginUser 获取当前登录的用户信息
//
// 该信息由 AuthFilter 存储在 ctx.Vars 之中。
func (m *Admin) LoginUser(ctx *web.Context) *modelAdmin {
	uid, found := ctx.Vars[adminKey]
	if !found {
		ctx.Server().Logs().Error("未检测到登录用户，可能是该接口未调用 admin.AuthFilter 中间件造成的！")
		return nil
	}
	a := &modelAdmin{ID: uid.(int64)}
	found, err := m.dbPrefix.DB(m.db).Select(a)
	if !found {
		ctx.Server().Logs().Error("未检测到登录用户，可能是该接口未调用 admin.AuthFilter 中间件造成的！")
		return nil
	}
	if err != nil {
		ctx.Server().Logs().Error(err)
		return nil
	}

	return a
}

// RegisterResources 注册资源
func (m *Admin) RegisterResources(mod string, res map[string]web.LocaleStringer) error {
	return m.rbac.RegisterResources(mod, res)
}

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
