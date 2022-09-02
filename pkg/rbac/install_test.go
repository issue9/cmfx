// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	const id = "rbac"
	parent := suite.NewModule(id)
	a.NotError(Install(parent, suite.DB()))
	curr, err := New(parent, suite.DB(), nil)
	a.NotError(err).NotNil(curr)

	exists, err := suite.DB().SQLBuilder().TableExists().Table(id + "_rbac_links").Exists()
	a.NotError(err).True(exists)

	exists, err = suite.DB().SQLBuilder().TableExists().Table(id + "_rbac_roles").Exists()
	a.NotError(err).True(exists)

}
