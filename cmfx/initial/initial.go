// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package initial 提供了项目初始化的一些方法
package initial

import (
	"net/http"

	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/middlewares"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	"github.com/issue9/webuse/v7/middlewares/empty"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
)

const contenxtKey contextType = 0

type contextType int

// Init 初始化当前框架的必要环境
//
// NOTE: 需要在添加路由之前调用，否则参数 r 的限制不启作用。
func Init(s web.Server, r *Ratelimit, plugin ...web.Plugin) {
	c := web.NewCache(r.Prefix, s.Cache())
	limit := ratelimit.New(c, r.Capacity, r.Rate.Duration(), nil, nil)
	s.Vars().Store(contenxtKey, limit)

	plugins := append(plugin,
		web.PluginFunc(locale),
		web.PluginFunc(problems),
		middlewares.Plugin(limit),
	)
	s.Use(plugins...)
}

// Unlimit 取消由 [Init] 创建 API 限制功能
func Unlimit(s web.Server) web.Middleware {
	if v, ok := s.Vars().Load(contenxtKey); ok {
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
		&web.LocaleProblem{ID: cmfx.BadRequestInvalidPath, Title: web.StringPhrase("bad request invalid param"), Detail: web.StringPhrase("bad request invalid param detail")},
		&web.LocaleProblem{ID: cmfx.BadRequestInvalidQuery, Title: web.StringPhrase("bad request invalid query"), Detail: web.StringPhrase("bad request invalid query detail")},
		&web.LocaleProblem{ID: cmfx.BadRequestInvalidHeader, Title: web.StringPhrase("bad request invalid header"), Detail: web.StringPhrase("bad request invalid header detail")},
		&web.LocaleProblem{ID: cmfx.BadRequestInvalidBody, Title: web.StringPhrase("bad request invalid body"), Detail: web.StringPhrase("bad request invalid body detail")},
		&web.LocaleProblem{ID: cmfx.BadRequestBodyTooLarger, Title: web.StringPhrase("bad request body too Larger"), Detail: web.StringPhrase("bad request body too Larger detail")},
		&web.LocaleProblem{ID: cmfx.BadRequestBodyNotAllowed, Title: web.StringPhrase("bad request body not allowed"), Detail: web.StringPhrase("bad request body not allowed detail")},
	).Add(http.StatusUnauthorized,
		&web.LocaleProblem{ID: cmfx.UnauthorizedInvalidState, Title: web.StringPhrase("unauthorized invalid state"), Detail: web.StringPhrase("unauthorized invalid state detail")},
		&web.LocaleProblem{ID: cmfx.UnauthorizedInvalidToken, Title: web.StringPhrase("unauthorized invalid token"), Detail: web.StringPhrase("unauthorized invalid token detail")},
		&web.LocaleProblem{ID: cmfx.UnauthorizedSecurityToken, Title: web.StringPhrase("unauthorized security token"), Detail: web.StringPhrase("unauthorized security token detail")},
		&web.LocaleProblem{ID: cmfx.UnauthorizedInvalidAccount, Title: web.StringPhrase("unauthorized invalid account"), Detail: web.StringPhrase("unauthorized invalid account detail")},
		&web.LocaleProblem{ID: cmfx.UnauthorizedNeedChangePassword, Title: web.StringPhrase("unauthorized need change password"), Detail: web.StringPhrase("unauthorized need change password detail")},
		&web.LocaleProblem{ID: cmfx.UnauthorizedRegistrable, Title: web.StringPhrase("identity registrable"), Detail: web.StringPhrase("identity registrable detail")},
	).Add(http.StatusForbidden,
		&web.LocaleProblem{ID: cmfx.ForbiddenStateNotAllow, Title: web.StringPhrase("forbidden state not allow"), Detail: web.StringPhrase("forbidden state not allow detail")},
		&web.LocaleProblem{ID: cmfx.ForbiddenCaNotDeleteYourself, Title: web.StringPhrase("forbidden can not delete yourself"), Detail: web.StringPhrase("forbidden can not delete yourself detail")},
	)
}
