// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

//go:generate web locale -l=und -m -f=yaml -o=./locales ./
//go:generate web update-locale -src=./locales/und.yaml -dest=./locales/zh.yaml

// Package cmfx 基于 https://github.com/issue9/web 框架的一些通用模块
package cmfx

// # restdoc cmfx 文档
//
// @media application/json application/xml application/cbor
// @version [Version]
// @tag admin 管理员端
// @tag rbac RBAC
// @tag auth 登录凭证
// @tag system 系统相关
// @tag settings 设置项
// @tag common 公共接口
// @resp 4XX * github.com/issue9/web.Problem
// @resp 5XX * github.com/issue9/web.Problem desc

import (
	"github.com/issue9/web"
	"github.com/issue9/web/locales"
)

// Version 表示当前框架的版本
const Version = "0.7.0"

// 400
const (
	BadRequest               = web.ProblemBadRequest
	BadRequestInvalidPath    = "40001"
	BadRequestInvalidQuery   = "40002"
	BadRequestInvalidHeader  = "40003"
	BadRequestInvalidBody    = "40004"
	BadRequestBodyTooLarger  = "40005"
	BadRequestBodyNotAllowed = "40006"
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

func ErrNotFound() error { return locales.ErrNotFound() }
