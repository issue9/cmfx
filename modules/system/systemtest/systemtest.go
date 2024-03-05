// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package systemtest

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/modules/system"
	"github.com/issue9/cmfx/pkg/test"
)

func NewSystem(s *test.Suite, adminM *admin.Admin, r *web.Router) *system.System {
	mod := s.NewModule("system")
	system.Install(mod)

	sys, err := system.New(mod, adminM)
	s.Assertion().NotError(err).NotNil(sys)

	return sys
}
