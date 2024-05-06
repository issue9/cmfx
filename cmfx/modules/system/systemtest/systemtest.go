// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package systemtest

import (
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
)

func NewSystem(s *test.Suite, adminL *admin.Loader) *system.Loader {
	mod := s.NewModule("system")
	system.Install(mod)

	conf := &system.Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	sys := system.Load(mod, conf, adminL)
	s.Assertion().NotNil(sys)

	return sys
}
