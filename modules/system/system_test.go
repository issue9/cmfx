// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx/modules/admin/admintest"
	"github.com/issue9/cmfx/pkg/test"
)

func newSystem(s *test.Suite) *System {
	adminM := admintest.NewAdmin(s)

	mod := s.NewModule("test")
	Install(mod)

	sys, err := New(mod, adminM)
	s.Assertion().NotError(err).NotNil(sys)

	return sys
}
