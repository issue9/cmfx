// SPDX-License-Identifier: MIT

package admintest

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/pkg/test"
	"github.com/issue9/cmfx/pkg/user"
)

func NewAdmin(s *test.Suite) (*admin.Admin, *web.Router) {
	mod := s.NewModule("admin")
	admin.Install(mod)

	o := &user.Config{
		URLPrefix:      "/admin",
		AccessExpires:  60,
		RefreshExpires: 120,
		Algorithms: []*user.Algorithm{
			{
				Type:    "HMAC",
				Name:    "HS256",
				Public:  "1112345",
				Private: "1112345",
			},
		},
	}
	s.Assertion().NotError(o.SanitizeConfig())

	r := s.NewRouter("def", nil)
	a, err := admin.New(mod, r, o)
	s.Assertion().NotError(err).NotNil(a)

	return a, r
}
