// SPDX-License-Identifier: MIT

package rbac

import (
	"github.com/issue9/cmfx/pkg/rules"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

type requestRole struct {
	XMLName struct{} `json:"-" xml:"role" yaml:"-"`
	Name    string   `json:"name" xml:"name" yaml:"name"`
	Desc    string   `json:"description" xml:"description" yaml:"description"`
	Parent  int64    `json:"parent,omitempty" xml:"parent,attr,omitempty" yaml:"parent,omitempty"`
}

func (r *requestRole) CTXSanitize(ctx *web.Context, v *web.Validation) {
	v.AddField(r.Desc, "description", rules.Required).
		AddField(r.Name, "name", rules.Required)
}

func (rbac *RBAC) GetRolesHandle(ctx *web.Context) web.Responser {
	type role struct {
		XMLName struct{} `json:"-" xml:"group"`
		ID      int64    `json:"id,omitempty" xml:"id,attr,omitempty" yaml:"id,omitempty"`
		Name    string   `json:"name" xml:"name" yaml:"name"`
		Desc    string   `json:"description" xml:"description" yaml:"description"`
		Parent  int64    `json:"parent,omitempty" xml:"parent,attr,omitempty" yaml:"parent,omitempty"`
	}

	rs := make([]*role, 0, len(rbac.roles))
	for _, r := range rbac.roles {
		rs = append(rs, &role{
			ID:     r.r.ID,
			Name:   r.r.Name,
			Desc:   r.r.Description,
			Parent: r.r.Parent,
		})
	}

	return web.OK(rs)
}

func (rbac *RBAC) PostRolesHandle(ctx *web.Context) web.Responser {
	data := &requestRole{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if _, err := rbac.NewRole(data.Parent, data.Name, data.Desc); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.Created(nil, "")
}

func (rbac *RBAC) PutRoleHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.ParamID(idName, cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	r := rbac.Role(id)
	if r == nil {
		return ctx.NotFound()
	}

	data := &requestRole{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := r.update(data.Name, data.Desc); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.NoContent()
}

func (rbac *RBAC) DeleteRole(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.ParamID(idName, cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	if err := rbac.deleteRole(id); err != nil {
		return ctx.InternalServerError(err)
	}
	return web.NoContent()
}

func (rbac *RBAC) GetResourcesHandle(ctx *web.Context) web.Responser {
	resources := make(map[string]string, len(rbac.resources))
	for k, v := range rbac.resources {
		resources[k] = v.LocaleString(ctx.LocalePrinter())
	}
	return web.OK(resources)
}

// GetRoleResourcesHandle 获得角色可访问的资源列表
func (rbac *RBAC) GetRoleResourcesHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.ParamID(idName, cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	if r := rbac.Role(id); r != nil {
		if len(r.r.Resources) > 0 {
			return web.OK(r.r.Resources)
		}
	}
	return ctx.NotFound()
}

// GetRoleAllowedResourcesHandle 获得权限组允许访问的资源列表
func (rbac *RBAC) GetRoleAllowedResourcesHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.ParamID(idName, cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	if r := rbac.Role(id); r != nil {
		if data := r.resources(); len(data) > 0 {
			return web.OK(data)
		}
	}
	return ctx.NotFound()
}

func (rbac *RBAC) PutRoleResourcesHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.ParamID(idName, cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	r := rbac.Role(id)
	if r == nil {
		return ctx.NotFound()
	}

	var data []string
	if resp := ctx.Read(true, &data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := r.set(data...); err != nil {
		return ctx.InternalServerError(err)
	}

	return web.NoContent()
}

// Filter 验证是否拥有指定的权限
func (rbac *RBAC) Filter(uid int64, mod string, res string, next web.HandlerFunc) web.HandlerFunc {
	res = buildResourceID(mod, res)
	return func(ctx *web.Context) web.Responser {
		allowed, err := rbac.IsAllow(uid, res)
		if err != nil {
			return ctx.InternalServerError(err)
		}

		if allowed {
			return next(ctx)
		}

		return ctx.Problem(cmfx.Forbidden)
	}
}
