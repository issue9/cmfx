// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package rbac

import (
	"cmp"
	"slices"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
)

// 角色信息
type reqRole struct {
	XMLName struct{} `json:"-" xml:"role" cbor:"-"`
	Name    string   `json:"name" xml:"name" cbor:"name"`
	Desc    string   `json:"description" xml:"description" cbor:"description"`
	Parent  string   `json:"parent,omitempty" xml:"parent,attr,omitempty" cbor:"parent,omitempty"`
}

func (r *reqRole) Filter(v *web.FilterContext) {
	v.Add(filters.NotEmpty("description", &r.Desc)).
		Add(filters.NotEmpty("name", &r.Name))
}

// 角色信息
type respRole struct {
	XMLName struct{} `json:"-" xml:"role" cbor:"role"`
	ID      string   `json:"id,omitempty" xml:"id,attr,omitempty" cbor:"id,omitempty"`
	Name    string   `json:"name" xml:"name" cbor:"name"`
	Desc    string   `json:"description" xml:"description" cbor:"description"`
	Parent  string   `json:"parent,omitempty" xml:"parent,attr,omitempty" cbor:"parent,omitempty"`
}

// GetRolesHandle 向客户端输出 g 中保存的所有角色列表
func GetRolesHandle(g *RoleGroup, ctx *web.Context) web.Responser {
	roles := g.Roles()
	rs := make([]*respRole, 0, len(roles))
	for _, r := range roles {
		rs = append(rs, &respRole{
			ID:     r.ID,
			Name:   r.Name,
			Desc:   r.Desc,
			Parent: r.Parent,
		})
	}
	slices.SortFunc(rs, func(a, b *respRole) int { return cmp.Compare(a.ID, b.ID) }) // 使输出保持一致

	return web.OK(rs)
}

// PostRolesHandle 向 g 中添加角色
func PostRolesHandle(g *RoleGroup, ctx *web.Context) web.Responser {
	data := &reqRole{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if _, err := g.NewRole(data.Name, data.Desc, data.Parent); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

// PutRoleHandle 修改角色信息
//
// idName 路由地址中表示角色 ID 的参数名称；
func PutRoleHandle(g *RoleGroup, idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathString(idName, cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	r := g.Role(id)
	if r == nil {
		return ctx.NotFound()
	}

	data := &reqRole{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := r.Set(data.Name, data.Desc); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// DeleteRoleHandle 删除角色
//
// idName 路由地址中表示角色 ID 的参数名称；
func DeleteRoleHandle(g *RoleGroup, idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathString(idName, cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	role := g.Role(id)
	if role == nil {
		return ctx.NotFound()
	}
	if err := role.Del(); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

// GetResourcesHandle 获取所有的资源信息
func GetResourcesHandle(g *RoleGroup, ctx *web.Context) web.Responser {
	return web.OK(g.RBAC().Resources(ctx.LocalePrinter()))
}

// GetRoleResourcesHandle 获得角色资源
//
// idName 路由地址中表示角色 ID 的参数名称；
func GetRoleResourcesHandle(g *RoleGroup, idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathString(idName, cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	if r := g.Role(id); r != nil {
		return web.OK(r.Resource())
	}
	return ctx.NotFound()
}

// PutRoleResourcesHandle 重新设置权限组的可访问资源
//
// idName 路由地址中表示角色 ID 的参数名称；
func PutRoleResourcesHandle(g *RoleGroup, idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathString(idName, cmfx.BadRequestInvalidPath)
	if resp != nil {
		return resp
	}

	r := g.Role(id)
	if r == nil {
		return ctx.NotFound()
	}

	var data []string
	if resp := ctx.Read(true, &data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := r.Allow(data...); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}
