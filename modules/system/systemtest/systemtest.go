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
	system.Install(s.Server, mod, s.DB())

	sys, err := system.New(mod, web.Phrase("system"), s.Server, s.DB(), r, adminM)
	s.Assertion().NotError(err).NotNil(sys)

	return sys
}
