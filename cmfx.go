// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

//go:generate web locale -l=und -m -f=yaml ./
//go:generate web update-locale -src=./locales/und.yaml -dest=./locales/zh-Hans.yaml

//go:generate web restdoc -d ./

// Package cmfx 基于 <https://github.com/issue9/web> 框架的一些通用模块
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
	"fmt"
	"os"

	"github.com/issue9/web"
)

// Version 表示当前框架的版本
const Version = "0.7.0"

// Init 执行一系列的初始化操作
//
// 依次执行 f 中的函数，碰到第一个返回错误的函数时即退出整个流程，并执行 cleanup 进行清理操作。
//
// cleanup 清理操作，只有当 f 出错时，才会执行 cleanup。
func Init(s web.Server, cleanup func(), f ...func() error) {
	for _, ff := range f {
		if err := ff(); err != nil {
			if cleanup != nil {
				cleanup()
			}

			var msg any
			if ls, ok := err.(web.LocaleStringer); ok {
				msg = ls.LocaleString(s.Locale().Printer())
			} else {
				msg = err
			}
			fmt.Fprintf(os.Stderr, "%+v\n", msg)
			os.Exit(2)
		}
	}
}
