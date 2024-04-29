// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

//go:generate web locale -l=und -m -f=yaml ./
//go:generate web update-locale -src=./locales/und.yaml -dest=./locales/zh-CN.yaml

// Package cmfx 基于 https://github.com/issue9/web 框架的一些通用模块
package cmfx

// # restdoc cmfx 文档
//
// @media application/json application/xml
// @version [Version]
// @tag admin 管理员端
// @tag rbac RBAC
// @resp 4XX * github.com/issue9/web.Problem
// @resp 5XX * github.com/issue9/web.Problem desc

import (
	"github.com/issue9/web"
	"github.com/issue9/web/locales"
)

// Version 表示当前框架的版本
const Version = "0.7.0"

// 定义可用的错误代码
const (
	BadRequest              = web.ProblemBadRequest
	BadRequestInvalidPath   = "40001"
	BadRequestInvalidQuery  = "40002"
	BadRequestInvalidHeader = "40003"
	BadRequestInvalidBody   = "40004"
)

// 401
const (
	Unauthorized                   = web.ProblemUnauthorized
	UnauthorizedInvalidState       = "40101"
	UnauthorizedInvalidToken       = "40102"
	UnauthorizedSecurityToken      = "40103" // 需要强验证
	UnauthorizedInvalidAccount     = "40104" // 无效的账号或密码
	UnauthorizedNeedChangePassword = "40105"

	// 可注册的状态，比如 OAuth2 验证，如果未注册，返回一个 ID 可用以注册。
	UnauthorizedRegistrable = "40106"
)

// 403
const (
	Forbidden                    = web.ProblemForbidden
	ForbiddenStateNotAllow       = "40301"
	ForbiddenCaNotDeleteYourself = "40302"
)

func ErrNotFound() error { return locales.ErrNotFound() }
