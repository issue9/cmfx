// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

// Package upload 提供上传功能
package upload

import (
	"errors"

	"github.com/issue9/upload/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/handlers/static"

	"github.com/issue9/cmfx/cmfx"
)

type Module struct {
	saver  upload.Saver
	prefix string
}

// Load 加载上传模块
//
// mod 指定上传模块的基本信息；
// prefix 上传 API 的地址前缀，同时也可能是上传文件组成的静态文件服务的地址前缀；
func Load(mod *cmfx.Module, prefix string, saver upload.Saver) *Module {
	mod.Router().Get(prefix+"/{file}", static.ServeFileHandler(saver, "file", "index.html"), mod.API(func(o *openapi.Operation) {
		o.Tag("upload").
			Desc(web.Phrase("upload static server"), nil).
			Path("file", openapi.TypeString, web.Phrase("the file name"), nil).
			Response("200", nil, nil, func(r *openapi.Response) {
				if r.Content == nil {
					r.Content = make(map[string]*openapi.Schema, 1)
				}
				r.Content["application/octet-stream"] = &openapi.Schema{
					Type:   openapi.TypeString,
					Format: openapi.FormatBinary,
				}
			})
	}))

	return &Module{saver: saver, prefix: prefix}
}

// Handle 注册上传接口
func (m *Module) Handle(prefix *web.Prefix, api func(func(*openapi.Operation)) web.Middleware, conf *Config) {
	up := m.Upload(conf)

	prefix.Post(m.prefix, func(ctx *web.Context) web.Responser {
		files, err := up.Do(conf.Field, ctx.Request())
		switch {
		case errors.Is(err, upload.ErrNotAllowSize()):
			return ctx.Problem(cmfx.RequestEntityTooLarge)
		case errors.Is(err, upload.ErrNotAllowExt()):
			return ctx.Problem(cmfx.BadRequestBodyNotAllowed)
		case err != nil:
			return ctx.Error(err, "")
		default:
			return web.OK(files)
		}
	}, api(func(o *openapi.Operation) {
		o.Tag("upload").
			Desc(web.Phrase("upload file"), nil).
			Response("201", []string{}, nil, nil)
	}))
}

// Upload 提供原始的 [upload.Upload] 对象
func (m *Module) Upload(conf *Config) *upload.Upload {
	return upload.New(m.saver, conf.Size, conf.Exts...)
}
