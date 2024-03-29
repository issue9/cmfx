// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("test")
	Install(mod)

	exists, err := suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "_users").Exists()
	a.NotError(err).True(exists)

	exists, err = suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "_securitylogs").Exists()
	a.NotError(err).True(exists)
}
