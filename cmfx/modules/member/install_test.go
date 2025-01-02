// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
	"github.com/issue9/cmfx/cmfx/modules/upload/uploadtest"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("member")
	l := Install(mod, defaultConfig(a), uploadtest.NewModule(suite, "mem_upload"), admintest.NewModule(suite), nil, nil)
	a.NotNil(l)

	suite.TableExists(mod.ID() + "_info").
		TableExists(mod.ID() + "_" + typesTableName).
		TableExists(mod.ID() + "_" + levelsTableName)
}
