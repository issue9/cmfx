// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
)

func newSystem(s *test.Suite) *Module {
	adminM := admintest.NewAdmin(s)

	conf := &Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	return Install(s.NewModule("test"), conf, adminM)
}
