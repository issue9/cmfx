// SPDX-License-Identifier: MIT

package admintest

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/pkg/test"
)

func NewAdmin(s *test.Suite) (*admin.Admin, *web.Router) {
	adminM := "admin"
	admin.Install(s.Server(), adminM, s.DB())
	s.Assertion().NotNil(adminM)

	o := &admin.Options{
		URLPrefix:      "/admin",
		AccessExpires:  60,
		RefreshExpires: 120,
		Algorithms: []*admin.Algorithm{
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
	a, err := admin.New(adminM, s.Server(), s.DB(), r, o)
	s.Assertion().NotError(err).NotNil(a)

	return a, r
}
