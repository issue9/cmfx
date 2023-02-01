// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin/admintest"
	"github.com/issue9/cmfx/pkg/test"
)

func newSystem(s *test.Suite) (*System, *web.Router) {
	adminM, r := admintest.NewAdmin(s)

	mod := "test"
	i := Install(s.Server(), mod, s.DB())
	s.Assertion().NotNil(i)

	sys, err := New(mod, s.Server(), s.DB(), r, adminM)
	s.Assertion().NotError(err).NotNil(sys)

	return sys, r
}
