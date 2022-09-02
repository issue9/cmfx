// SPDX-License-Identifier: MIT

package admintest

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/pkg/test"
	"github.com/issue9/cmfx/pkg/token"
)

func NewAdmin(s *test.Suite) (*admin.Admin, *web.Router) {
	adminM := s.NewModule("admin")
	admin.Install(adminM, s.DB())
	s.Assertion().NotNil(adminM)

	conf := &token.Config{
		Expired:   60,
		Refreshed: 120,
	}
	s.Assertion().NotError(conf.SanitizeConfig())
	r := s.NewRouter()
	a, err := admin.New(adminM, s.DB(), "/admin", conf, r)
	s.Assertion().NotError(err).NotNil(a)

	return a, r
}
