// SPDX-License-Identifier: MIT

package config

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web/app"
)

var _ app.ConfigSanitizer = &User{}

func TestUser_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	o := &User{URLPrefix: "admin"}
	a.Equal(o.SanitizeConfig().Field, "urlPrefix")

	o = &User{URLPrefix: "/admin"}
	a.Equal(o.SanitizeConfig().Field, "accessExpires")

	o = &User{URLPrefix: "/admin", AccessExpires: 60}
	a.Equal(o.SanitizeConfig().Field, "algorithms")

	o = &User{
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
