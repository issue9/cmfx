// SPDX-License-Identifier: MIT

package admin

import "github.com/issue9/web"

// <api method="get" summary="获取权限组列表">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups" />
//     <response status="200" type="object" array="true">
//         <param name="id" xml-attr="true" type="number" summary="权限组 ID" />
//         <param name="name" type="string" summary="权限组名称" />
//         <param name="description" type="string" summary="权限组描信信息" />
//         <param name="parent" xml-attr="true" type="number" summary="父类 " />
//     </response>
// </api>
func (m *Admin) getGroups(ctx *web.Context) web.Responser {
	return m.rbac.GetRolesHandle(ctx)
}

// <api method="post" summary="添加一个权限组">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups" />
//     <request type="object">
//         <header name="Authorization" type="string" summary="登录凭证 token" />
//         <param name="name" type="string" summary="权限组名称" />
//         <param name="description" type="string" summary="权限组描信信息" />
//         <param name="parent" type="number" summary="上一级权限组" />
//     </request>
//     <response status="201" />
// </api>
func (m *Admin) postGroups(ctx *web.Context) web.Responser {
	return m.rbac.PostRolesHandle(ctx)
}

// <api method="put" summary="修改权限组">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups/{id}">
//         <param name="id" type="number" summary="权限组 ID" />
//     </path>
//     <request type="object">
//         <header name="Authorization" type="string" summary="登录凭证 token" />
//         <param name="name" type="string" summary="权限组名称" />
//         <param name="description" type="string" summary="权限组描信信息" />
//     </request>
//     <response status="204" />
// </api>
func (m *Admin) putGroup(ctx *web.Context) web.Responser {
	return m.rbac.PutRoleHandle("id", ctx)
}

// <api method="delete" summary="删除权限组">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups/{id}">
//         <param name="id" type="number" summary="权限组 ID" />
//     </path>
//     <response status="204" />
// </api>
func (m *Admin) deleteGroup(ctx *web.Context) web.Responser {
	return m.rbac.DeleteRole("id", ctx)
}

// <api method="GET" summary="获取所有的资源">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/resources" />
//     <response status="200" type="object">
//         <param name="key" type="string" summary="资源 ID 及与双对应的描述" />
//         <example mimetype="application/json"><![CDATA[
//  {
//      "admin:resources-list":"查看资源列表",
//      "admin:resources-list":"查看资源列表"
//  }
//         ]]></example>
//     </response>
// </api>
func (m *Admin) getResources(ctx *web.Context) web.Responser {
	return m.rbac.GetResourcesHandle(ctx)
}

// <api method="GET" summary="获得权限组可访问的资源列表">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups/{id}/resources">
//         <param name="id" type="number" summary="权限组 ID" />
//     </path>
//     <response status="200" type="object">
//         <param name="key" type="string" summary="资源 ID 及与双对应的描述" />
//         <example mimetype="application/json"><![CDATA[
//  {
//      "admin:resources-list":"查看资源列表",
//      "admin:resources-list":"查看资源列表"
//  }
//         ]]></example>
//     </response>
// </api>
func (m *Admin) getGroupResources(ctx *web.Context) web.Responser {
	return m.rbac.GetRoleResourcesHandle("id", ctx)
}

// <api method="GET" summary="获得权限组允许访问的资源列表">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups/{id}/resources/allowed">
//         <param name="id" type="number" summary="权限组 ID" />
//     </path>
//     <response status="200" type="object">
//         <param name="key" type="string" summary="资源 ID 及与双对应的描述" />
//         <example mimetype="application/json"><![CDATA[
//  {
//      "admin:resources-list":"查看资源列表",
//      "admin:resources-list":"查看资源列表"
//  }
//         ]]></example>
//     </response>
// </api>
func (m *Admin) getGroupAllowedResources(ctx *web.Context) web.Responser {
	return m.rbac.GetRoleAllowedResourcesHandle("id", ctx)
}

// <api method="put" summary="设置权限组的可访问的资源">
//     <server>admin</server>
//     <tag>rbac</tag>
//     <tag>admin</tag>
//     <path path="/groups/{id}/resources">
//         <param name="id" type="number" summary="权限组 ID" />
//     </path>
//     <request type="string" array="true">
//         <param name="key" type="string" summary="资源 ID" />
//         <example mimetype="application/json"><![CDATA[
//      	["admin:resources-list","admin:resources-list"]
//         ]]></example>
//     </request>
//     <response status="204" />
// </api>
func (m *Admin) putGroupResources(ctx *web.Context) web.Responser {
	return m.rbac.PutRoleResourcesHandle("id", ctx)
}
