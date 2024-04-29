// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package systemtest

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/inital/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
)

func NewSystem(s *test.Suite, adminL *admin.Loader, r *web.Router) *system.Loader {
	mod := s.NewModule("system")
	system.Install(mod)

	sys := system.Load(mod, adminL)
	s.Assertion().NotNil(sys)

	return sys
}
