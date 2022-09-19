// SPDX-License-Identifier: MIT

package eav

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	id := "eav"
	InstallSimple(id, suite.DB())
	exists, err := suite.DB().SQLBuilder().TableExists().Table(id + "_simple_eav").Exists()
	a.NotError(err).True(exists)

	id = "eav2"
	InstallSimple(id, suite.DB())
	exists, err = suite.DB().SQLBuilder().TableExists().Table(id + "_simple_eav").Exists()
	a.NotError(err).True(exists)
}
