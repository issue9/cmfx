// SPDX-License-Identifier: MIT

package admin

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func newAdmin(s *test.Suite) (*Admin, *web.Router) {
	adminM := "admin"
	Install(s.Server(), adminM, s.DB())
	s.Assertion().NotNil(adminM)

	o := &Options{
		URLPrefix:      "/admin",
		AccessExpires:  60,
		RefreshExpires: 120,
		Algorithms: []*Algorithm{
			{
				Type:    "HMAC",
				Name:    "HS256",
				Public:  "1112345",
				Private: "1112345",
			},
		},
	}
	s.Assertion().NotError(o.SanitizeConfig())

	r := s.Router()
	a, err := New(adminM, s.Server(), s.DB(), r, o)
	s.Assertion().NotError(err).NotNil(a)

	return a, r
}
