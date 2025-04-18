// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	adminL := admintest.NewModule(s)

	conf := &Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	mod := s.NewModule("mod")

	l := Install(mod, conf, adminL)
	a.NotNil(l)

	s.TableExists("mod_api_healths")
}
