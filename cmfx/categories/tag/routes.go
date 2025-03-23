// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package tag

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
)

type TagTO struct {
	XMLName struct{} `json:"-" cbor:"-" yaml:"-" xml:"info"`
	Title   string   `json:"title" cbor:"title" yaml:"title" xml:"title"`
}

func (t *TagTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("title", &t.Title))
}

// HandlePostTags 添加子元素
func (m *Module) HandlePostTags(ctx *web.Context) web.Responser {
	data := &TagTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := m.Add(data.Title); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

// HandlePutTag 更新指定 ID 项的路由
//
// idKey 路由中表示标签 ID 的名称；
func (m *Module) HandlePutTag(ctx *web.Context, idKey string) web.Responser {
	id, resp := ctx.PathID(idKey, cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	data := &TagTO{}
	if resp = ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	if err := m.Set(id, data.Title); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// HandleGetTags 获取所有标签项的路由
func (m *Module) HandleGetTags(ctx *web.Context) web.Responser {
	l, err := m.Get()
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(l)
}
