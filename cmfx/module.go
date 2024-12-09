// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package cmfx

import (
	"fmt"
	"net/http"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	"github.com/issue9/webuse/v7/middlewares/empty"

	"github.com/issue9/cmfx/cmfx/locales"
)

const (
	moduleKey serverVarsKey = 0
	limitKey  serverVarsKey = 1
)

type serverVarsKey int

// Module 表示代码模块的基本信息
//
// Module 是代码复用的基本单元，根据模块 ID 不同，会生成不同的表名称，从尔达到整个单元复用的目的。
type Module struct {
	id   string
	desc web.LocaleStringer
	s    web.Server
	db   *orm.DB
	r    *web.Router
	doc  *openapi.Document
	tags []string
}

// NewModule 声明新模块
//
// [Init] 会返回一个根模块，一般情况下使用该模块的 New 方法创建模块就可以了，
// 除非项目涉及到多数据库、需要多个 [openapi.Document] 实例或是多路由等情况，才需要用到此方法。
func NewModule(id string, desc web.LocaleStringer, s web.Server, db *orm.DB, r *web.Router, doc *openapi.Document, tags ...string) *Module {
	// 防止重复的 id 值
	m, loaded := s.Vars().LoadOrStore(moduleKey, map[string]struct{}{id: {}})
	if loaded {
		mm := m.(map[string]struct{})
		if _, found := mm[id]; found {
			panic(fmt.Sprintf("存在相同 id 的模块：%s\n", id))
		} else {
			mm[id] = struct{}{}
			s.Vars().Store(moduleKey, mm)
		}
	}

	return &Module{
		id:   id,
		desc: desc,
		s:    s,
		db:   db.New(id),
		r:    r,
		doc:  doc,
		tags: tags,
	}
}

// ID 模块的唯一 ID
func (m *Module) ID() string { return m.id }

// Desc 对该模块的描述
func (m *Module) Desc() web.LocaleStringer { return m.desc }

// Server 关联的 [web.Server] 对象
func (m *Module) Server() web.Server { return m.s }

// DB 以当前实现的 [Module.ID] 表名前缀的操作接口
func (m *Module) DB() *orm.DB { return m.db }

func (m *Module) Engine(tx *orm.Tx) orm.Engine {
	if tx == nil {
		return m.DB()
	}
	return tx.NewEngine(m.DB().TablePrefix())
}

// New 基于当前模块的 ID 声明一个新的实例
//
// tag 表示采用当前实例的 [Module.API] 生成的文档需要带上的标签。
func (m *Module) New(id string, desc web.LocaleStringer, tag ...string) *Module {
	tags := append(m.tags, tag...)
	return NewModule(m.ID()+id, desc, m.Server(), m.DB(), m.Router(), m.doc, tags...)
}

// Router 当前模块关联的路由对象
func (m *Module) Router() *web.Router { return m.r }

func (m *Module) OpenAPI() *openapi.Document { return m.doc }

// API 创建 openapi 文档的中间件
//
// NOTE: 该方法会附带上指定的标签，如果不需要可以使用 [Module.OpenAPI] 返回的对象。
func (m *Module) API(f func(o *openapi.Operation)) web.Middleware {
	ff := f
	if len(m.tags) > 0 {
		ff = func(o *openapi.Operation) {
			o.Tag(m.tags...)
			f(o)
		}
	}
	return m.doc.API(ff)
}

// Init 初始化当前框架的必要环境
func Init(s web.Server, limit *ratelimit.Ratelimit, db *orm.DB, router *web.Router, doc *openapi.Document) *Module {
	s.Vars().Store(limitKey, limit)

	s.Use(
		web.PluginFunc(locale),
		web.PluginFunc(problems),
		middlewares.Plugin(limit),
	)

	s.OnClose(func() error { return db.Close() })

	return NewModule("", web.Phrase("root module"), s, db, router, doc)
}

// Unlimit 取消由 [Init] 创建的 API 访问次数限制功能
func Unlimit(s web.Server) web.Middleware {
	if v, ok := s.Vars().Load(limitKey); ok {
		return (v.(*ratelimit.Ratelimit)).Unlimit()
	}
	return &empty.Empty{}
}

// 加载本地化的信息
func locale(s web.Server) {
	if err := s.Locale().LoadMessages("*.yaml", locales.All...); err != nil {
		s.Logs().ERROR().Error(err)
	}
}

// 初始化与 [web.Problem] 相关的本地化信息
func problems(s web.Server) {
	s.Problems().Add(http.StatusBadRequest,
		&web.LocaleProblem{ID: BadRequestInvalidPath, Title: web.StringPhrase("bad request invalid param"), Detail: web.StringPhrase("bad request invalid param detail")},
		&web.LocaleProblem{ID: BadRequestInvalidQuery, Title: web.StringPhrase("bad request invalid query"), Detail: web.StringPhrase("bad request invalid query detail")},
		&web.LocaleProblem{ID: BadRequestInvalidHeader, Title: web.StringPhrase("bad request invalid header"), Detail: web.StringPhrase("bad request invalid header detail")},
		&web.LocaleProblem{ID: BadRequestInvalidBody, Title: web.StringPhrase("bad request invalid body"), Detail: web.StringPhrase("bad request invalid body detail")},
		&web.LocaleProblem{ID: BadRequestBodyNotAllowed, Title: web.StringPhrase("bad request body not allowed"), Detail: web.StringPhrase("bad request body not allowed detail")},
	).Add(http.StatusUnauthorized,
		&web.LocaleProblem{ID: UnauthorizedInvalidState, Title: web.StringPhrase("unauthorized invalid state"), Detail: web.StringPhrase("unauthorized invalid state detail")},
		&web.LocaleProblem{ID: UnauthorizedInvalidToken, Title: web.StringPhrase("unauthorized invalid token"), Detail: web.StringPhrase("unauthorized invalid token detail")},
		&web.LocaleProblem{ID: UnauthorizedSecurityToken, Title: web.StringPhrase("unauthorized security token"), Detail: web.StringPhrase("unauthorized security token detail")},
		&web.LocaleProblem{ID: UnauthorizedInvalidAccount, Title: web.StringPhrase("unauthorized invalid account"), Detail: web.StringPhrase("unauthorized invalid account detail")},
		&web.LocaleProblem{ID: UnauthorizedNeedChangePassword, Title: web.StringPhrase("unauthorized need change password"), Detail: web.StringPhrase("unauthorized need change password detail")},
		&web.LocaleProblem{ID: UnauthorizedRegistrable, Title: web.StringPhrase("identity registrable"), Detail: web.StringPhrase("identity registrable detail")},
	).Add(http.StatusForbidden,
		&web.LocaleProblem{ID: ForbiddenStateNotAllow, Title: web.StringPhrase("forbidden state not allow"), Detail: web.StringPhrase("forbidden state not allow detail")},
		&web.LocaleProblem{ID: ForbiddenCaNotDeleteYourself, Title: web.StringPhrase("forbidden can not delete yourself"), Detail: web.StringPhrase("forbidden can not delete yourself detail")},
	)
}
