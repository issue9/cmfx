// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"
	"github.com/issue9/web/server/config"

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

	SSE *SSE `json:"sse,omitempty" xml:"sse,omitempty" yaml:"sse,omitempty"`
}

// SSE 的相关配置
type SSE struct {
	// 如果不为零表示发送心跳包的时间
	KeepAlive config.Duration `json:"keepAlive,omitempty" xml:"keepAlive,attr,omitempty" yaml:"keepAlive,omitempty"`

	// 缓存队列的大小，默认为 10，必须大于 1 才有效。
	Cap int `json:"cap,omitempty" xml:"cap,attr,omitempty" yaml:"cap,omitempty"`

	// 如果大于零，表示发送 retry 的值。
	Retry config.Duration `json:"retry,omitempty" xml:"retry,attr,omitempty" yaml:"retry,omitempty"`
}

func (c *Config) SanitizeConfig() *web.FieldError {
	if c.SuperUser <= 0 {
		return web.NewFieldError("superUser", locales.MustBeGreaterThan(0))
	}

	if c.User != nil {
		if err := c.User.SanitizeConfig(); err != nil {
			err.AddFieldParent("user")
		}
	} else {
		return web.NewFieldError("user", locales.Required)
	}

	if c.Upload != nil {
		if err := c.Upload.SanitizeConfig(); err != nil {
			return err.AddFieldParent("upload")
		}
	} else {
		return web.NewFieldError("upload", locales.Required)
	}

	if c.SSE == nil {
		c.SSE = &SSE{}
	}
	if err := c.SSE.SanitizeConfig(); err != nil {
		return err.AddFieldParent("sse")
	}

	return nil
}

func (c *SSE) SanitizeConfig() *web.FieldError {
	if c.Cap == 0 {
		c.Cap = 10
	}

	return nil
}
