// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	u := usertest.NewModule(suite)
	Install(u, "point")

	suite.TableExists(u.Module().ID() + "_point_overviews").
		TableExists(u.Module().ID() + "_point_expires").
		TableExists(u.Module().ID() + "_point_logs")
}
