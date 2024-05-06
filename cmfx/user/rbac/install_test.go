// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)

	exists, err := suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "_rbac_links").Exists()
	a.NotError(err).True(exists)

	exists, err = suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "_rbac_roles").Exists()
	a.NotError(err).True(exists)
}
