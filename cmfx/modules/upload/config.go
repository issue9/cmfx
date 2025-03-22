// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package upload

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/locales"
)

// Config 上传的配置项
type Config struct {
	// 允许上传的文件大小
	Size int64 `json:"size" xml:"size,attr" yaml:"size" toml:"size"`

	// 允许上传的扩展名
	Exts []string `json:"exts" xml:"exts>ext" yaml:"exts" toml:"exts"`

	// 上传内容中表示文件的字段名
	Field string `json:"field" xml:"field" yaml:"field" toml:"field"`
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
