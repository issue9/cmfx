// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
)

func newSystem(s *test.Suite) *Loader {
	adminM := admintest.NewAdmin(s)

	mod := s.NewModule("test")
	Install(mod)

	conf := &Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	sys := Load(mod, conf, adminM)
	s.Assertion().NotNil(sys)

	return sys
}
