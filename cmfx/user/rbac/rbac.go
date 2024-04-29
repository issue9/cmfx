// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package rbac 简单的 RBAC 权限规则实现
package rbac

import (
	"github.com/issue9/webuse/v7/middlewares/acl/rbac"

	"github.com/issue9/cmfx/cmfx"
)

type (
	RBAC          = rbac.RBAC[int64]
	ResourceGroup = rbac.ResourceGroup[int64]
	RoleGroup     = rbac.RoleGroup[int64]
	Role          = rbac.Role[int64]
)

// New 声明一个以 int64 作为用户唯一 ID 的 [RBAC]
func New(mod *cmfx.Module, f rbac.GetUIDFunc[int64]) *RBAC {
	return rbac.New(mod.Server(), newDBStore(mod), f)
}
