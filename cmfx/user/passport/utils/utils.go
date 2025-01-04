// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package utils 提供 passport 的一些工具
package utils

import (
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
)

// BuildDB 根据表名生成 [orm.DB] 对象
func BuildDB(mod *cmfx.Module, tableName string) *orm.DB {
	return mod.DB().New(mod.DB().TablePrefix() + "_auth_" + tableName)
}

func BuildRate(user *user.Module, id string) *ratelimit.Ratelimit {
	return ratelimit.New(web.NewCache(user.Module().ID()+"passports_"+id+"_rate", user.Module().Server().Cache()), 20, time.Second, nil)
}

func BuildPrefix(user *user.Module, id string) string {
	return user.URLPrefix() + "/passports/" + id
}
