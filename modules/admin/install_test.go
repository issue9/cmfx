// SPDX-License-Identifier: MIT

package admin

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	id := "test"
	Install(id, suite.DB())

	exists, err := suite.DB().SQLBuilder().TableExists().Table(id + "_admins").Exists()
	a.NotError(err).True(exists)

	exists, err = suite.DB().SQLBuilder().TableExists().Table(id + "_settings").Exists()
	a.NotError(err).True(exists)
}
