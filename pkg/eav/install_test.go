// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	id := "eav"
	InstallSimple(suite.Server, id, suite.DB())
	exists, err := suite.DB().SQLBuilder().TableExists().Table(id).Exists()
	a.NotError(err).True(exists)

	id = "eav2"
	InstallSimple(suite.Server, id, suite.DB())
	exists, err = suite.DB().SQLBuilder().TableExists().Table(id).Exists()
	a.NotError(err).True(exists)
}
