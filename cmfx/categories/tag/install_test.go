// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package tag

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

	l := Install(mod, "lk", "t1", "t2")
	a.NotNil(l)

	s.TableExists("mod_tag_lk")
}
