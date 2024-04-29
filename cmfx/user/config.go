// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"strconv"
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
)

// Config 当前模块的配置项
type Config struct {
	// 路由地址的前缀
	//
	// 可以为空。
	URLPrefix string `json:"urlPrefix,omitempty" xml:"urlPrefix,omitempty" yaml:"urlPrefix,omitempty"` // TODO 去掉？在 admin 指定？

	// 访问令牌的过期时间，单位为秒。
	AccessExpired int `json:"accessExpired,omitempty" xml:"accessExpired,attr,omitempty" yaml:"accessExpired,omitempty"`
	accessExpired time.Duration

	// 刷新令牌的过期时间，单位为秒，如果为 0 则采用用 expires * 2 作为默认值。
	RefreshExpired int `json:"refreshExpired,omitempty" xml:"refreshExpired,attr,omitempty" yaml:"refreshExpired,omitempty"`
	refreshExpired time.Duration

	IdentityExpired int `json:"identityExpired" xml:"identityExpired" yaml:"identityExpired"`
	identityExpired time.Duration
}

// SanitizeConfig 用于检测和修正配置项的内容
func (o *Config) SanitizeConfig() *web.FieldError {
	if o.URLPrefix != "" && o.URLPrefix[0] != '/' {
		return web.NewFieldError("urlPrefix", locales.InvalidValue)
	}

	if o.AccessExpired < 60 {
		return web.NewFieldError("accessExpired", locales.MustBeGreaterThan(60))
	}

	if o.RefreshExpired == 0 {
		o.RefreshExpired = o.AccessExpired * 2
	}
	if o.RefreshExpired <= o.AccessExpired {
		return web.NewFieldError("refreshExpired", locales.MustBeGreaterThan(strconv.Quote("accessExpired")))
	}

	if o.IdentityExpired < 1 {
		return web.NewFieldError("identityExpired", locales.MustBeGreaterThan(0))
	}

	o.accessExpired = time.Duration(o.AccessExpired) * time.Second
	o.refreshExpired = time.Duration(o.RefreshExpired) * time.Second
	o.identityExpired = time.Duration(o.IdentityExpired) * time.Second

	return nil
}
