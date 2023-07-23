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
	Install(s.Server, mod, s.DB())

	sys, err := New(mod, web.Phrase("system"), s.Server, s.DB(), r, adminM)
	s.Assertion().NotError(err).NotNil(sys)

	return sys, r
}
