// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"testing"
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
		SuperUser: 1,
		User: &user.Config{
			URLPrefix:      "/admin",
			AccessExpired:  config.Duration(time.Minute),
			RefreshExpired: config.Duration(time.Minute * 2),
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

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	conf := &Config{}
	err := conf.SanitizeConfig()
	a.Equal(err.Field, "superUser")
}
