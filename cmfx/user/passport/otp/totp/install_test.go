// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package hotp

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("test")
	Install(mod, "totp")

	suite.TableExists(mod.ID() + "_auth_totp")
}
