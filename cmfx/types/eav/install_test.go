// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/inital/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	InstallSimple(suite.NewModule("test_"), "eav")
	exists, err := suite.DB().SQLBuilder().TableExists().Table("test_eav").Exists()
	a.NotError(err).True(exists)

	InstallSimple(suite.NewModule("test"), "eav2")
	exists, err = suite.DB().SQLBuilder().TableExists().Table("testeav2").Exists()
	a.NotError(err).True(exists)
}
