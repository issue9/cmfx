// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)

	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("test")
	Install(mod)

	s.TableExists(mod.ID() + "_" + typesKey).
		TableExists(mod.ID() + "_" + groupsKey).
		TableExists(mod.ID() + "_notice_group").
		TableExists(mod.ID() + "_notices")
}
