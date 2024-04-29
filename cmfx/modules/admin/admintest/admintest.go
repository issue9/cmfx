// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admintest

import (
	"github.com/issue9/cmfx/cmfx/inital/test"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/user"
)

func NewAdmin(s *test.Suite) *admin.Loader {
	mod := s.NewModule("admin")
	admin.Install(mod)

	o := &user.Config{
		URLPrefix:      "/admin",
		AccessExpired:  60,
		RefreshExpired: 120,
	}
	s.Assertion().NotError(o.SanitizeConfig())

	a := admin.Load(mod, o)
	s.Assertion().NotNil(a)

	return a
}
