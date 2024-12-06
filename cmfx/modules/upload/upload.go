// SPDX-FileCopyrightText: 2024 caixw
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
	"github.com/issue9/cmfx/cmfx/locales"
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

// Handle 提供上传功能
func (m *Module) Handle(prefix *web.Prefix, api func(func(*openapi.Operation)) web.Middleware, conf *Config) {
	up := upload.New(m.saver, conf.Size, conf.Exts...)

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

type Config struct {
	Size int64 `json:"size" xml:"size,attr" yaml:"size"`

	Exts []string `json:"exts" xml:"exts>ext" yaml:"exts"`

	// 上传内容中表示文件的字段名
	Field string `json:"field" xml:"field" yaml:"field"`
}

func (u *Config) SanitizeConfig() *web.FieldError {
	if u.Size < 0 {
		return web.NewFieldError("size", locales.MustBeGreaterThan(-1))
	}

	if u.Field == "" {
		return web.NewFieldError("field", locales.Required)
	}

	return nil
}
