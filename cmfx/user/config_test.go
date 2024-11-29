// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	xconf "github.com/issue9/config"
	"github.com/issue9/web/server/config"
)

var _ xconf.Sanitizer = &Config{}

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	o := &Config{URLPrefix: "admin"}
	a.Equal(o.SanitizeConfig().Field, "urlPrefix")

	o = &Config{URLPrefix: "/admin"}
	a.NotError(o.SanitizeConfig()).
		Equal(o.AccessExpired, 30*time.Minute)

	o = &Config{URLPrefix: "/admin", AccessExpired: config.Duration(time.Hour)}
	a.NotError(o.SanitizeConfig()).
		Equal(o.AccessExpired, config.Duration(time.Hour)).
		Equal(o.RefreshExpired, config.Duration(time.Hour)*2)
}
