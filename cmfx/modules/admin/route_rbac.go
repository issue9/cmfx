// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/user/rbac"
)

func (m *Module) getRoles(ctx *web.Context) web.Responser {
	return rbac.GetRolesHandle(m.roleGroup, ctx)
}

func (m *Module) postRoles(ctx *web.Context) web.Responser {
	return rbac.PostRolesHandle(m.roleGroup, ctx)
}

func (m *Module) putRole(ctx *web.Context) web.Responser {
	return rbac.PutRoleHandle(m.roleGroup, "id", ctx)
}

func (m *Module) deleteRole(ctx *web.Context) web.Responser {
	return rbac.DeleteRoleHandle(m.roleGroup, "id", ctx)
}

func (m *Module) getResources(ctx *web.Context) web.Responser {
	return rbac.GetResourcesHandle(m.roleGroup, ctx)
}

func (m *Module) getRoleResources(ctx *web.Context) web.Responser {
	return rbac.GetRoleResourcesHandle(m.roleGroup, "id", ctx)
}

func (m *Module) putRoleResources(ctx *web.Context) web.Responser {
	return rbac.PutRoleResourcesHandle(m.roleGroup, "id", ctx)
}
