// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/user"
)

type Config struct {
	// User 用户相关的配置
	User *user.Config `json:"user" xml:"user" yaml:"user" toml:"user"`

	// 上传接口的相关配置
	Upload *upload.Config `json:"upload" xml:"upload" yaml:"upload" toml:"upload"`
}

func (c *Config) SanitizeConfig() *web.FieldError {
	if err := c.User.SanitizeConfig(); err != nil {
		return err.AddFieldParent("user")
	}

	if c.Upload != nil {
		if err := c.Upload.SanitizeConfig(); err != nil {
			return err.AddFieldParent("upload")
		}
	} else {
		return web.NewFieldError("upload", locales.Required)
	}

	return nil
}
