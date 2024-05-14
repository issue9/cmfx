// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package systemtest

import (
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
)

func NewSystem(s *test.Suite, adminL *admin.Module) *system.Module {
	mod := s.NewModule("system")

	conf := &system.Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	sys := system.Install(mod, conf, adminL)
	s.Assertion().NotNil(sys)

	return sys
}
