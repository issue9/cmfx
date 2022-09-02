// SPDX-License-Identifier: MIT

package token

import (
	"testing"

	gojwt "github.com/golang-jwt/jwt/v4"
	"github.com/issue9/assert/v3"
)

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	conf := &Config{
		HMAC: []*hmac{
			{
				ID:     "1",
				Method: "HS256",
				Secret: "abc",
			},
		},
		Expired: 60,
	}
	a.NotError(conf.SanitizeConfig())
	h := conf.HMAC[0]
	a.Equal(h.method, gojwt.SigningMethodHS256).
		Equal(h.secret, []byte(h.Secret)).
		Equal(conf.Refreshed, 2*conf.Expired)

	conf = &Config{
		HMAC: []*hmac{
			{
				ID:     "1",
				Method: "not-exists",
				Secret: "abc",
			},
		},

		Expired: 60,
	}
	err := conf.SanitizeConfig()
	a.Equal(err.Field, "hmac[0].method")
}
