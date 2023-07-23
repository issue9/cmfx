// SPDX-License-Identifier: MIT

package rbac

import (
	"sort"

	"github.com/issue9/web"
	"golang.org/x/text/message"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/filters"
)

type requestRole struct {
	XMLName struct{} `json:"-" xml:"role"`
	Name    string   `json:"name" xml:"name"`
	Desc    string   `json:"description" xml:"description"`
	Parent  int64    `json:"parent,omitempty" xml:"parent,attr,omitempty"`
}

type responseResource struct {
	ID    string `json:"id" xml:"id,attr"`
	Title string `json:"title" xml:",chardata"`
}

type responseResponseGroup struct {
	Title     string             `json:"title" xml:"title"`
	Resources []responseResource `json:"resources" xml:"resource"`
}

type responseResources struct {
	XMLName struct{}                `json:"-" xml:"resources"`
	Groups  []responseResponseGroup `json:"groups" xml:"resource"`
}

func (r *requestRole) CTXFilter(v *web.FilterProblem) {
	v.AddFilter(filters.RequiredString("description", &r.Desc)).
		AddFilter(filters.RequiredString("name", &r.Name))
}

func buildResponseResources(p *message.Printer, gs map[string]*Group) *responseResources {
	resources := &responseResources{}
	for _, g := range gs {
		gg := responseResponseGroup{
			Title:     g.desc.LocaleString(p),
			Resources: make([]responseResource, 0, len(g.resources)),
		}

		for id, title := range g.resources {
			gg.Resources = append(gg.Resources, responseResource{
				ID:    id,
				Title: title.LocaleString(p),
			})
		}
		sort.SliceStable(gg.Resources, func(i, j int) bool { return gg.Resources[i].ID < gg.Resources[j].ID })
		resources.Groups = append(resources.Groups, gg)
	}
	sort.SliceStable(resources.Groups, func(i, j int) bool {
		return resources.Groups[i].Title < resources.Groups[j].Title
	})

	return resources
}

func (rbac *RBAC) GetRolesHandle(ctx *web.Context) web.Responser {
	type role struct {
		XMLName struct{} `json:"-" xml:"group"`
		ID      int64    `json:"id,omitempty" xml:"id,attr,omitempty"`
		Name    string   `json:"name" xml:"name"`
		Desc    string   `json:"description" xml:"description"`
		Parent  int64    `json:"parent,omitempty" xml:"parent,attr,omitempty"`
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
	id, resp := ctx.PathID(idName, cmfx.BadRequestInvalidParam)
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

func (rbac *RBAC) DeleteRoleHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathID(idName, cmfx.BadRequestInvalidParam)
	if resp != nil {
		return resp
	}

	if err := rbac.deleteRole(id); err != nil {
		return ctx.InternalServerError(err)
	}
	return web.NoContent()
}

func (rbac *RBAC) GetResourcesHandle(ctx *web.Context) web.Responser {
	p := ctx.LocalePrinter()
	return web.OK(buildResponseResources(p, rbac.groups))
}

// GetRoleResourcesHandle 获得角色已被允许访问的资源
func (rbac *RBAC) GetRoleResourcesHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathID(idName, cmfx.BadRequestInvalidParam)
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

// GetRoleAllowedResourcesHandle 获取该角色可分配的资源列表
func (rbac *RBAC) GetRoleAllowedResourcesHandle(idName string, ctx *web.Context) web.Responser {
	id, resp := ctx.PathID(idName, cmfx.BadRequestInvalidParam)
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
	id, resp := ctx.PathID(idName, cmfx.BadRequestInvalidParam)
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
//
// uid 需要验证的用户；
// group 资源的分组；
// res 资源 ID；
func (rbac *RBAC) Filter(uid int64, res string, next web.HandlerFunc) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		allowed, err := rbac.isAllow(uid, res)
		if err != nil {
			return ctx.InternalServerError(err)
		}

		if allowed {
			return next(ctx)
		}
		return ctx.Problem(cmfx.Forbidden)
	}
}
