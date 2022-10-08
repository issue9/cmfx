// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
	"github.com/issue9/cmfx/pkg/token"
)

func newAdmin(s *test.Suite) (*Admin, *web.Router) {
	adminM := "admin"
	Install(adminM, s.DB())
	s.Assertion().NotNil(adminM)

	conf := &token.Config{
		Expired:   60,
		Refreshed: 120,
		HMAC: []*token.HMAC{
			{
				ID:     "11",
				Method: "HS256",
				Secret: "123412314",
			},
		},
	}
	s.Assertion().NotError(conf.SanitizeConfig())
	r := s.NewRouter()
	a, err := New(adminM, s.Server(), s.DB(), "/admin", conf, r)
	s.Assertion().NotError(err).NotNil(a)

	return a, r
}
