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
	a.Equal(o.SanitizeConfig().Field, "accessExpires")

	o = &Config{URLPrefix: "/admin", AccessExpires: 60}
	a.Equal(o.SanitizeConfig().Field, "algorithms")

	o = &Config{
		URLPrefix:     "/admin",
		AccessExpires: 60,
		Algorithms: []*Algorithm{
			{
				Type:    "hmac",
				Name:    "HS256",
				Public:  "123",
				Private: "123",
			},
		},
	}
	a.NotError(o.SanitizeConfig()).
		Equal(o.AccessExpires, 60).
		Equal(o.RefreshExpires, 60*2).
		Length(o.Algorithms, 1)
}
