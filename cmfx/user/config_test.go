// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/config"
)

var _ config.Sanitizer = &Config{}

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	o := &Config{URLPrefix: "admin"}
	a.Equal(o.SanitizeConfig().Field, "urlPrefix")

	o = &Config{URLPrefix: "/admin"}
	a.Equal(o.SanitizeConfig().Field, "accessExpired")

	o = &Config{URLPrefix: "/admin", AccessExpired: 60}
	a.NotError(o.SanitizeConfig()).
		Equal(o.AccessExpired, 60).
		Equal(o.RefreshExpired, 60*2)
}
