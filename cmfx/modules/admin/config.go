// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/user"
)

type Config struct {
	// SuperUser 超级用户的 ID
	SuperUser int64 `json:"superUser" xml:"superUser,attr" yaml:"superUser"`

	// User 用户相关的配置
	User *user.Config `json:"user" xml:"user" yaml:"user"`

	// 上传接口的相关配置
	Upload *upload.Config `json:"upload" xml:"upload" yaml:"upload"`
}

func (c *Config) SanitizeConfig() *web.FieldError {
	if c.SuperUser <= 0 {
		return web.NewFieldError("superUser", locales.MustBeGreaterThan(0))
	}

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
