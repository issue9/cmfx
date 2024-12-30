// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"time"

	"github.com/issue9/assert/v4"
	xconf "github.com/issue9/config"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/modules/upload"
	"github.com/issue9/cmfx/cmfx/user"
)

var _ xconf.Sanitizer = &Config{}

func defaultConfig(a *assert.Assertion) *Config {
	o := &Config{
		User: &user.Config{
			URLPrefix:      "/member",
			AccessExpired:  60 * config.Duration(time.Second),
			RefreshExpired: 120 * config.Duration(time.Second),
		},
		Upload: &upload.Config{
			Size:  1024 * 1024 * 1024,
			Exts:  []string{".jpg"},
			Field: "files",
		},
	}

	a.NotError(o.SanitizeConfig())

	return o
}
