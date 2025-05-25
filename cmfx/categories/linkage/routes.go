// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"errors"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/locales"
)

type LinkageTO struct {
	XMLName struct{} `xml:"linkage" json:"-" cbor:"-" yaml:"-"`
	Title   string   `json:"title" xml:"title" cbor:"title" yaml:"title"`
	Icon    string   `json:"icon,omitempty" xml:"icon,omitempty" cbor:"icon,omitempty" yaml:"icon,omitempty"`
	Order   int      `json:"order,omitempty" xml:"order,attr,omitempty" cbor:"order,omitempty" yaml:"order,omitempty"`
}

func (l *LinkageTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("title", &l.Title)).
		Add(filters.Avatar("icon", &l.Icon))
}

// HandlePostLinkage 向 ID 指向的对象添加子项
func (m *Linkages) HandlePostLinkage(ctx *web.Context, idKey string) web.Responser {
	id, resp := ctx.PathID(idKey, cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	data := &LinkageTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	switch err := m.Add(id, data.Title, data.Icon, data.Order); {
	case errors.Is(err, locales.ErrNotFound()):
		return ctx.NotFound()
	case err != nil:
		return ctx.Error(err, "")
	default:
		return web.Created(nil, "")
	}
}

// HandlePutLinkage 修改 ID 指向的对象
func (m *Linkages) HandlePutLinkage(ctx *web.Context, idKey string) web.Responser {
	id, resp := ctx.PathID(idKey, cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	data := &LinkageTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	switch err := m.Set(id, data.Title, data.Icon, data.Order); {
	case errors.Is(err, locales.ErrNotFound()):
		return ctx.NotFound()
	case err != nil:
		return ctx.Error(err, "")
	default:
		return web.NoContent()
	}
}

// HandleDeleteLinkage 删除指向 ID 的对象
func (m *Linkages) HandleDeleteLinkage(ctx *web.Context, idKey string) web.Responser {
	id, resp := ctx.PathID(idKey, cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	switch err := m.Delete(id); {
	case errors.Is(err, locales.ErrNotFound()):
		return ctx.NotFound()
	case err != nil:
		return ctx.Error(err, "")
	default:
		return web.NoContent()
	}
}

// HandleGetLinkages 返回所有的对象
func (m *Linkages) HandleGetLinkages(ctx *web.Context) web.Responser {
	l, err := m.Get()
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(l)
}
