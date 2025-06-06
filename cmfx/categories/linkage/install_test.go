// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("mod")

	a.PanicString(func() {
		Install(mod, "lk", nil)
	}, "参数 linkage 不能为空")

	l := Install(mod, "lk", &Linkage{
		Title: "t1",
		Icon:  "icon",
	})
	a.NotNil(l)

	s.TableExists("mod_lk")
}
