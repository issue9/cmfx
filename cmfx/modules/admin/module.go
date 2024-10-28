// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"context"
	"errors"
	"time"

	"github.com/issue9/events"
	"github.com/issue9/orm/v6"
	"github.com/issue9/upload/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/handlers/static"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	xrbac "github.com/issue9/webuse/v7/middlewares/acl/rbac"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/password"
	"github.com/issue9/cmfx/cmfx/user/rbac"
)

const passportTypePassword = "password" // 采用密码登录的

type Module struct {
	user            *user.Module
	defaultPassword string

	roleGroup *rbac.RoleGroup

	uploadField string

	// 用户登录和注销事件
	loginEvent  *events.Event[*user.User]
	logoutEvent *events.Event[*user.User]
}

// Load 加载管理模块
//
// o 表示初始化的一些额外选项，这些值可以直接从配置文件中加载；
// saver 上传功能的保存方式；
func Load(mod *cmfx.Module, o *Config, saver upload.Saver) *Module {
	mod.Server().Use(web.PluginFunc(addProblems))

	u := user.Load(mod, o.User)

	u.Passport().Register(passportTypePassword, password.New(mod, "passwords", 8), web.StringPhrase("password mode"))
	m := &Module{
		user:            u,
		defaultPassword: o.DefaultPassword,

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
		Get("/passports", m.getPassports, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "auth").
				Desc(web.Phrase("get passports api"), nil).
				Response("200", &respAdapters{}, nil, nil)
		})).
		Post("/login", m.postLogin, loginRate, initial.Unlimit(mod.Server()), mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "auth").
				Desc(web.Phrase("admin login api"), nil).
				Body(&user.Account{}, false, nil, nil).
				Response("201", &token.Response{}, nil, nil)
		})).
		Delete("/login", m.deleteLogin, m, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "auth").
				Desc(web.Phrase("admin logout api"), nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Put("/login", m.putToken, m, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "auth").
				Desc(web.Phrase("admin refresh token api"), nil).
				Response("201", &token.Response{}, nil, nil)
		}))

	mod.Router().Prefix(m.URLPrefix(), m).
		Get("/resources", m.getResources, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				Desc(web.Phrase("get resources list api"), nil).
				Response("200", &xrbac.Resources{}, nil, nil)
		})).
		Get("/roles", m.getRoles, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				Desc(web.Phrase("get roles list api"), nil).
				Response("200", []rbac.RoleVO{}, nil, nil)
		})).
		Post("/roles", m.postRoles, postGroup, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				Desc(web.Phrase("add role api"), nil).
				ResponseRef("201", "empty", nil, nil).
				Body(&rbac.RoleDTO{}, false, nil, nil)
		})).
		Put("/roles/{id:digit}", m.putRole, putGroup, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				PathID("id:digit", web.Phrase("the role id")).
				Desc(web.Phrase("edit role info api"), nil).
				Body(&rbac.RoleDTO{}, false, nil, nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Delete("/roles/{id:digit}", m.deleteRole, delGroup, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				Desc(web.Phrase("delete role api"), nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Get("/roles/{id:digit}/resources", m.getRoleResources, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				PathID("id:digit", web.Phrase("the role id")).
				Desc(web.Phrase("get role resources api"), nil).
				Response("200", &xrbac.RoleResources{}, nil, nil)
		})).
		Put("/roles/{id:digit}/resources", m.putRoleResources, putGroupResources, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "rbac").
				Desc(web.Phrase("edit role resources api"), nil).
				Body([]string{}, false, nil, nil).
				ResponseRef("204", "empty", nil, nil)
		}))

	mod.Router().Prefix(m.URLPrefix(), m).
		Get("/info", m.getInfo, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("get login user info api"), nil).
				Response("200", info{}, nil, nil)
		})).
		Patch("/info", m.patchInfo, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("patch login user info api"), nil).
				Body(info{}, false, nil, nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Get("/securitylog", m.getSecurityLogs, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				QueryObject(user.QueryLogDTO{}, nil).
				Desc(web.Phrase("get login user security log api"), nil).
				Response("200", user.LogVO{}, nil, nil)
		}))

	mod.Router().Prefix(m.URLPrefix(), m).
		Get("/admins", m.getAdmins, getAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("get admin list api"), nil).
				QueryObject(&queryAdmins{}, func(p *openapi.Parameter) {
					if p.Name == "sex" {
						p.Schema.Enum = []any{"unknown", "female", "male"}
					}
				}).
				Response("200", query.Page[ctxInfoWithRoleState]{}, nil, nil)
		})).
		Post("/admins", m.postAdmins, postAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("add admin api"), nil).
				Body(&infoWithAccountDTO{}, false, nil, nil).
				ResponseRef("201", "empty", nil, nil)
		})).
		Get("/admins/{id:digit}", m.getAdmin, getAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("get admin info api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				Response("200", &adminInfoVO{}, nil, nil)
		})).
		Patch("/admins/{id:digit}", m.patchAdmin, putAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("patch admin info api"), nil).
				Body(&ctxInfoWithRoleState{}, false, nil, nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Post("/admins/{id:digit}/locked", m.postAdminLocked, putAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("lock the admin api"), nil).
				PathID("id:digit", web.Phrase("the ID of admin")).
				ResponseRef("201", "empty", nil, nil)
		})).
		Delete("/admins/{id:digit}/locked", m.deleteAdminLocked, putAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("unlock the admin api"), nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Delete("/admins/{id:digit}", m.deleteAdmin, delAdmin, mod.API(func(o *openapi.Operation) {
			o.Tag("admin").
				Desc(web.Phrase("delete the admin api"), nil).
				ResponseRef("204", "empty", nil, nil)
		}))

	// passport
	mod.Router().Prefix(m.URLPrefix(), m).
		Delete("/passports/{type}", m.deletePassport).
		Post("/passports/{type}", m.postPassport).
		Patch("/passports/{type}", m.patchPassport).
		Put("/passports/{type}", m.putPassport).
		Delete("/admins/{id:digit}/passports/{type}", m.deleteAdminPassport).
		Post("/admins/{id:digit}/passports/{type}", m.postAdminPassport).
		Patch("/admins/{id:digit}/passports/{type}", m.patchAdminPassport).
		Put("/admins/{id:digit}/passports/{type}", m.putAdminPassport)

	// upload
	up := upload.New(saver, o.Upload.Size, o.Upload.Exts...)
	mod.Router().Prefix(m.URLPrefix()).
		Get("/upload/{file}", static.ServeFileHandler(up, "file", "index.html"), mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "upload").
				Desc(web.Phrase("upload static server"), nil).
				Path("file", openapi.TypeString, web.Phrase("the file name"), nil).
				Response("200", nil, nil, func(r *openapi.Response) {
					if r.Content == nil {
						r.Content = make(map[string]*openapi.Schema, 1)
					}
					r.Content["application/octet-stream"] = &openapi.Schema{
						Type:   openapi.TypeString,
						Format: openapi.FormatBinary,
					}
				})
		}))
	mod.Router().Prefix(m.URLPrefix(), m).
		Post("/upload", func(ctx *web.Context) web.Responser {
			files, err := up.Do(m.uploadField, ctx.Request())
			switch {
			case errors.Is(err, upload.ErrNotAllowSize()):
				return ctx.Problem(cmfx.BadRequestBodyTooLarger)
			case errors.Is(err, upload.ErrNotAllowExt()):
				return ctx.Problem(cmfx.BadRequestBodyNotAllowed)
			case err != nil:
				return ctx.Error(err, "")
			default:
				return web.OK(files)
			}
		}, mod.API(func(o *openapi.Operation) {
			o.Tag("admin", "upload").
				Desc(web.Phrase("upload file"), nil).
				Response("201", []string{}, nil, nil)
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
func (m *Module) newAdmin(data *infoWithAccountDTO, now time.Time) error {
	uid, err := m.user.NewUser(m.Passport().Get(passportTypePassword), data.Username, data.Password, now)
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
