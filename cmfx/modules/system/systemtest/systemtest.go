// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package systemtest

import (
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/modules/system"
)

// NewModule 声明一个用于测试的 [system.Module] 实例
func NewModule(s *test.Suite, adminM *admin.Module) *system.Module {
	mod := s.NewModule("system")

	conf := &system.Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	sys := system.Install(mod, conf, adminM)
	s.Assertion().NotNil(sys)

	return sys
}
