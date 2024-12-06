// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

//go:generate web locale -l=und -m -f=yaml -o=./locales ./
//go:generate web update-locale -src=./locales/und.yaml -dest=./locales/zh.yaml

// Package cmfx 基于 https://github.com/issue9/web 框架的一些通用模块
package cmfx

import (
	"github.com/issue9/web"
	"github.com/issue9/web/locales"
	"github.com/issue9/web/openapi"
)

// Version 表示当前框架的版本
const Version = "0.7.7"

// 400
const (
	BadRequest               = web.ProblemBadRequest
	BadRequestInvalidPath    = "40001"
	BadRequestInvalidQuery   = "40002"
	BadRequestInvalidHeader  = "40003"
	BadRequestInvalidBody    = "40004"
	BadRequestBodyNotAllowed = "40005" // 提交内容的类型不允许，比如不允许的上传类型等
)

// 401
const (
	Unauthorized                   = web.ProblemUnauthorized
	UnauthorizedInvalidState       = "40101"
	UnauthorizedInvalidToken       = "40102"
	UnauthorizedSecurityToken      = "40103" // 需要强验证
	UnauthorizedInvalidAccount     = "40104" // 无效的账号或密码
	UnauthorizedNeedChangePassword = "40105"
	UnauthorizedRegistrable        = "40106" // 可注册的状态，比如 OAuth2 验证，如果未注册，返回一个 ID 可用以注册。
)

// 403
const (
	Forbidden                    = web.ProblemForbidden
	ForbiddenStateNotAllow       = "40301"
	ForbiddenCaNotDeleteYourself = "40302"
)

// 404
const NotFound = web.ProblemNotFound

// 413
const RequestEntityTooLarge = web.ProblemRequestEntityTooLarge

func ErrNotFound() error { return locales.ErrNotFound() }

// WithTags 当前框架所使用的 openapi 标签
func WithTags() openapi.Option {
	return openapi.WithOptions(
		openapi.WithTag("admin", web.Phrase("admin tag"), "", nil),
		openapi.WithTag("auth", web.Phrase("auth tag"), "", nil),
		openapi.WithTag("rbac", web.Phrase("rbac tag"), "", nil),
		openapi.WithTag("system", web.Phrase("system tag"), "", nil),
		openapi.WithTag("settings", web.Phrase("settings tag"), "", nil),
		openapi.WithTag("upload", web.Phrase("upload tag"), "", nil),
		openapi.WithTag("member", web.Phrase("member tag"), "", nil),
	)
}
