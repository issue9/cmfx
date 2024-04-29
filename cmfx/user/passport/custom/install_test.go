// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package custom

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/inital/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("test")

	Install(mod, "test")

	exists, err := suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "test").Exists()
	a.NotError(err).True(exists)
}
