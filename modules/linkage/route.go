// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

// HandleGet 返回指定 ID 的列表
//
// 路由地址格式为 prefix/{key:digit} key 为参数 key 指定的值
func (r *Root[T]) BuildHandleGet(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.PathID(key, cmfx.BadRequestInvalidPath)
		if resp != nil {
			return resp
		}
		if id == 0 {
			return web.OK(r.Item)
		}

		c, found := r.Get(id)
		if !found {
			return ctx.NotFound()
		}
		return web.OK(c)
	}
}

// BuildHandlePost 添加子项
//
// 路由地址格式为 prefix/{key:digit} key 为参数 key 指定的值
func (r *Root[T]) BuildHandlePost(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.PathID(key, cmfx.BadRequestInvalidPath)
		if resp != nil {
			return resp
		}

		var v T
		if resp = ctx.Read(true, &v, cmfx.BadRequestInvalidBody); resp != nil {
			return resp
		}

		if err := r.Add(id, v); err != nil {
			return ctx.Error(err, "")
		}
		return web.Created(nil, "")
	}
}

// HandlePut 修改子项
//
// 路由地址格式为 prefix/{key:digit} key 为参数 key 指定的值
func (r *Root[T]) BuildHandlePut(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.PathID(key, cmfx.BadRequestInvalidPath)
		if resp != nil {
			return resp
		}

		var v T
		if resp = ctx.Read(true, &v, cmfx.BadRequestInvalidBody); resp != nil {
			return resp
		}

		if err := r.Update(id, v); err != nil {
			return ctx.Error(err, "")
		}
		return web.NoContent()
	}
}

// HandleDelete 删除子项
//
// 路由地址格式为 prefix/{key:digit} key 为参数 key 指定的值
func (r *Root[T]) BuildHandleDelete(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.PathID(key, cmfx.BadRequestInvalidPath)
		if resp != nil {
			return resp
		}

		if err := r.Delete(id); err != nil {
			return ctx.Error(err, "")
		}
		return web.NoContent()
	}
}
