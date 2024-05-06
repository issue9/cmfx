// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/user/rbac"
)

// # api get /roles 获取权限组列表
// @tag admin rbac
// @resp 200 * []github.com/issue9/cmfx/cmfx/user/rbac.respRole
func (l *Loader) getRoles(ctx *web.Context) web.Responser {
	return rbac.GetRolesHandle(l.roleGroup, ctx)
}

// # api post /roles 添加一个权限组
// @tag admin rbac
// @req * github.com/issue9/cmfx/cmfx/user/rbac.reqRole
// @resp 201 * {}
func (l *Loader) postRoles(ctx *web.Context) web.Responser {
	return rbac.PostRolesHandle(l.roleGroup, ctx)
}

// # api put /roles/{id} 修改权限组
// @tag admin rbac
// @path id id 权限组 ID
// @req * github.com/issue9/cmfx/cmfx/user/rbac.reqRole
// @resp 204 * {}
func (l *Loader) putRole(ctx *web.Context) web.Responser {
	return rbac.PutRoleHandle(l.roleGroup, "id", ctx)
}

// # api delete /roles/{id} 删除权限组
// @tag admin rbac
// @path id id 权限组 ID
// @resp 204 * {}
func (l *Loader) deleteRole(ctx *web.Context) web.Responser {
	return rbac.DeleteRoleHandle(l.roleGroup, "id", ctx)
}

// # api get /resources 获取所有的资源
// @tag admin rbac
// @resp 200 * map 键名为资源 ID，键值为资源描述
func (l *Loader) getResources(ctx *web.Context) web.Responser {
	return rbac.GetResourcesHandle(l.roleGroup, ctx)
}

// # api get /roles/{id}/resources 获得角色已被允许访问的资源
// @tag admin rbac
// @path id id 权限组 ID
// @resp 200 application/json map 键名为资源 ID，键值为资源描述
func (l *Loader) getRoleResources(ctx *web.Context) web.Responser {
	return rbac.GetRoleResourcesHandle(l.roleGroup, "id", ctx)
}

// # api patch /roles/{id}/resources 设置权限组的可访问的资源
// @tag admin rbac
// @path id id 权限组 ID
// @req * []string 资源 ID 列表
// @resp 204 * {}
func (l *Loader) putRoleResources(ctx *web.Context) web.Responser {
	return rbac.PutRoleResourcesHandle(l.roleGroup, "id", ctx)
}