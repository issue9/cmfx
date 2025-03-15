// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)

	s := test.NewSuite(a)
	defer s.Close()

	u := usertest.NewModule(s)
	Install(u)

	s.TableExists(u.Module().ID() + "_" + typesKey).
		TableExists(u.Module().ID() + "_notice_groups").
		TableExists(u.Module().ID() + "_notices")
}
