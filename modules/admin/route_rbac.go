// SPDX-License-Identifier: MIT

package admin

import "github.com/issue9/web"

// # api get /groups 获取权限组列表
// @tag admin rbac
// @resp 200 * []github.com/issue9/cmfx/pkg/rbac.roleResp
// <api method="get" summary="获取权限组列表">
func (m *Admin) getGroups(ctx *web.Context) web.Responser {
	return m.rbac.GetRolesHandle(ctx)
}

// # api post /groups 添加一个权限组
// @tag admin rbac
// @req * github.com/issue9/cmfx/pkg/rbac.requestRole
// @resp 201 * {}
func (m *Admin) postGroups(ctx *web.Context) web.Responser {
	return m.rbac.PostRolesHandle(ctx)
}

// # api put /groups/{id} 修改权限组
// @tag admin rbac
// @path id id 权限组 ID
// @req * github.com/issue9/cmfx/pkg/rbac.requestRole
// @resp 204 * {}
func (m *Admin) putGroup(ctx *web.Context) web.Responser {
	return m.rbac.PutRoleHandle("id", ctx)
}

// # api delete /groups/{id} 删除权限组
// @tag admin rbac
// @path id id 权限组 ID
// @resp 204 * {}
func (m *Admin) deleteGroup(ctx *web.Context) web.Responser {
	return m.rbac.DeleteRoleHandle("id", ctx)
}

// # api get /resources 获取所有的资源
// @tag admin rbac
// @resp 200 application/json map 键名为资源 ID，键值为资源描述
func (m *Admin) getResources(ctx *web.Context) web.Responser {
	return m.rbac.GetResourcesHandle(ctx)
}

// # api get /groups/{id}/resources 获得角色已被允许访问的资源
// @tag admin rbac
// @path id id 权限组 ID
// @resp 200 application/json map 键名为资源 ID，键值为资源描述
func (m *Admin) getGroupResources(ctx *web.Context) web.Responser {
	return m.rbac.GetRoleResourcesHandle("id", ctx)
}

// # api get /groups/{id}/resources/allowed 获得权限组可分配的资源列表
// @tag admin rbac
// @path id id 权限组 ID
// @resp 200 application/json map 键名为资源 ID，键值为资源描述
func (m *Admin) getGroupAllowedResources(ctx *web.Context) web.Responser {
	return m.rbac.GetRoleAllowedResourcesHandle("id", ctx)
}

// # api patch /groups/{id}/resources 设置权限组的可访问的资源
// @tag admin rbac
// @path id id 权限组 ID
// @req * []string 资源 ID 列表
// @resp 204 * {}
func (m *Admin) patchGroupResources(ctx *web.Context) web.Responser {
	return m.rbac.PutRoleResourcesHandle("id", ctx)
}
