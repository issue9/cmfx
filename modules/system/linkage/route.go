// SPDX-License-Identifier: MIT

package linkage

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

// HandleGet 返回指定 ID 的列表
func (r *Root[T]) BuildHandleGet(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.ParamID(key, cmfx.BadRequestInvalidParam)
		if resp != nil {
			return resp
		}
		if id == 0 {
			return web.OK(r.to(&r.Item))
		}

		c, found := r.findItem(id)
		if !found {
			return ctx.NotFound()
		}
		return web.OK(c)
	}
}

// BuildHandlePost
func (r *Root[T]) BuildHandlePost(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.ParamID(key, cmfx.BadRequestInvalidParam)
		if resp != nil {
			return resp
		}

		var v T
		if resp = ctx.Read(true, &v, cmfx.BadRequestInvalidBody); resp != nil {
			return resp
		}

		if err := r.Add(id, v); err != nil {
			return ctx.InternalServerError(err)
		}
		return web.Created(nil, "")
	}
}

// HandlePut
func (r *Root[T]) BuildHandlePut(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.ParamID(key, cmfx.BadRequestInvalidParam)
		if resp != nil {
			return resp
		}

		var v T
		if resp = ctx.Read(true, &v, cmfx.BadRequestInvalidBody); resp != nil {
			return resp
		}

		if err := r.Update(id, v); err != nil {
			return ctx.InternalServerError(err)
		}
		return web.NoContent()
	}
}

// HandleDelete
func (r *Root[T]) BuildHandleDelete(key string) web.HandlerFunc {
	return func(ctx *web.Context) web.Responser {
		id, resp := ctx.ParamID(key, cmfx.BadRequestInvalidParam)
		if resp != nil {
			return resp
		}

		if err := r.Delete(id); err != nil {
			return ctx.InternalServerError(err)
		}
		return web.NoContent()
	}
}
