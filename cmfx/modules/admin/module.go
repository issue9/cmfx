// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/sse"
	"github.com/issue9/web/openapi"
	xrbac "github.com/issue9/webuse/v7/middlewares/acl/rbac"
	"github.com/issue9/webuse/v7/middlewares/auth/temporary"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

type Module struct {
	user      *user.Module
	roleGroup *rbac.RoleGroup
	sse       *sse.Server[int64]
	temp      *temporary.Temporary[*user.User]
}

// Load 加载管理模块
//
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
// up 上传模块；
func Load(mod *cmfx.Module, o *Config, up *upload.Module) *Module {
	m := &Module{
		user: user.Load(mod, o.User),
		sse:  sse.NewServer[int64](mod.Server(), o.SSE.Retry.Duration(), o.SSE.KeepAlive.Duration(), o.SSE.Cap, web.Phrase("admin sse server")),
		temp: temporary.New[*user.User](mod.Server(), time.Minute, true, "token", cmfx.UnauthorizedInvalidToken, web.ProblemInternalServerError),
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

	p := mod.Router().Prefix(m.URLPrefix(), m)

	p.Get("/resources", m.getResources, mod.API(func(o *openapi.Operation) {
		o.Tag("rbac").
			Desc(web.Phrase("get resources list api"), nil).
			Response200(xrbac.Resources{})
	})).
		Get("/roles", m.getRoles, mod.API(func(o *openapi.Operation) {
			o.Tag("rbac").
				Desc(web.Phrase("get roles list api"), nil).
				Response200([]rbac.RoleVO{})
		})).
		Post("/roles", m.postRoles, postGroup, mod.API(func(o *openapi.Operation) {
			o.Tag("rbac").
				Desc(web.Phrase("add role api"), nil).
				ResponseEmpty("201").
				Body(&rbac.RoleTO{}, false, nil, nil)
		})).
		Put("/roles/{id:digit}", m.putRole, putGroup, mod.API(func(o *openapi.Operation) {
			o.Tag("rbac").
				PathID("id:digit", web.Phrase("the role id")).
				Desc(web.Phrase("edit role info api"), nil).
				Body(&rbac.RoleTO{}, false, nil, nil).
				ResponseEmpty("204")
		})).
		Delete("/roles/{id:digit}", m.deleteRole, delGroup, mod.API(func(o *openapi.Operation) {
			o.Tag("rbac").
				Desc(web.Phrase("delete role api"), nil).
				ResponseEmpty("204")
		})).
		Get("/roles/{id:digit}/resources", m.getRoleResources, mod.API(func(o *openapi.Operation) {
			o.Tag("rbac").
				PathID("id:digit", web.Phrase("the role id")).
				Desc(web.Phrase("get role resources api"), nil).
				Response200(&xrbac.RoleResources{})
		})).
		Put("/roles/{id:digit}/resources", m.putRoleResources, putGroupResources, mod.API(func(o *openapi.Operation) {
			o.Tag("rbac").
				Desc(web.Phrase("edit role resources api"), nil).
				Body([]string{}, false, nil, nil).
				ResponseEmpty("204")
		})).
		Post("/sse", m.postSSE, mod.API(func(o *openapi.Operation) {
			o.Tag("sse").
				Desc(web.Phrase("create sse token api"), nil).
				Response("201", temporary.Response{Expire: 60}, nil, nil)
		}))

	mod.Router().Prefix(m.URLPrefix(), m.temp).
		Get("/sse", m.getSSE, mod.API(func(o *openapi.Operation) {
			o.Tag("sse").
				Desc(web.Phrase("get SSE message api"), o.Document().ParameterizedDoc(`registered sse protocol:
%s`)).
				Query(m.temp.QueryName(), openapi.TypeString, web.Phrase("user token"), nil).
				Response("200", nil, nil, func(r *openapi.Response) {
					r.Body = nil
					r.Content = map[string]*openapi.Schema{
						sse.Mimetype: {Type: openapi.TypeString, Format: openapi.FormatByte},
					}
				}).
				SecuritySecheme(m.temp.SecurityScheme("sse-security", nil))
		}))

	p.Get("/info", m.getInfo, mod.API(func(o *openapi.Operation) {
		o.Desc(web.Phrase("get login user info api"), nil).
			Response200(infoWithPassportVO{})
	})).
		Patch("/info", m.patchInfo, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("patch login user info api"), nil).
				Body(info{}, false, nil, nil).
				ResponseEmpty("204")
		}))

	p.Get("/admins", m.getAdmins, getAdmin, mod.API(func(o *openapi.Operation) {
		o.Desc(web.Phrase("get admin list api"), nil).
			QueryObject(&queryAdmins{}, nil).
			Response200(query.Page[infoWithRoleStateVO]{})
	})).
		Post("/admins", m.postAdmins, postAdmin, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("add admin api"), nil).
				Body(&infoWithAccountTO{}, false, nil, nil).
				ResponseEmpty("201")
		})).
		Get("/admins/{id:digit}", m.getAdmin, getAdmin, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("get admin info api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				Response200(&adminInfoVO{})
		})).
		Patch("/admins/{id:digit}", m.patchAdmin, putAdmin, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("patch admin info api"), nil).
				Body(&infoWithRoleStateVO{}, false, nil, nil).
				ResponseEmpty("204")
		})).
		Post("/admins/{id:digit}/locked", m.postAdminLocked, putAdmin, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("lock the admin api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				ResponseEmpty("201")
		})).
		Delete("/admins/{id:digit}/locked", m.deleteAdminLocked, putAdmin, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("unlock the admin api"), nil).
				ResponseEmpty("204")
		})).
		Delete("/admins/{id:digit}", m.deleteAdmin, delAdmin, mod.API(func(o *openapi.Operation) {
			o.Desc(web.Phrase("delete the admin api"), nil).
				ResponseEmpty("204")
		}))

	up.Handle(p, mod.API, o.Upload)

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

func (m *Module) UserModule() *user.Module { return m.user }

// 手动添加一个新的管理员
func (m *Module) addAdmin(data *infoWithAccountTO, ip, ua, content string) error {
	u, err := m.user.New(user.StateNormal, data.Username, data.Password, ip, ua, content)
	if err != nil {
		return err
	}

	a := &info{
		ID:       u.ID,
		Nickname: data.Nickname,
		Name:     data.Name,
		Avatar:   data.Avatar,
		Sex:      data.Sex,
	}
	if _, err = m.user.Module().DB().Insert(a); err != nil {
		return err
	}

	// NOTE: role.Link 内可能会包含事务。
	for _, role := range data.roles {
		if err := role.Link(u.ID); err != nil {
			return err
		}
	}

	return nil
}

func (m *Module) newRole(name, desc, parent string) (*rbac.Role, error) {
	return m.roleGroup.NewRole(name, desc, parent)
}

// SSE 返回 SSE 服务的接口
func (m *Module) SSE() *sse.Server[int64] { return m.sse }
