// SPDX-License-Identifier: MIT

package systemtest

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/modules/system"
	"github.com/issue9/cmfx/pkg/test"
)

func NewSystem(s *test.Suite, adminM *admin.Admin, r *web.Router) *system.System {
	mod := "system"
	i := system.Install(mod, s.DB())
	s.Assertion().NotNil(i)

	sys, err := system.New(mod, s.Server(), s.DB(), r, adminM)
	s.Assertion().NotError(err).NotNil(sys)

	return sys
}
