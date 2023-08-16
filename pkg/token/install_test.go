// SPDX-License-Identifier: MIT

package token

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("ttt")
	Install(mod)

	exists, err := suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "_token_blocked_users").Exists()
	a.NotError(err).True(exists)

	exists, err = suite.DB().SQLBuilder().TableExists().Table(mod.ID() + "_token_blocked_tokens").Exists()
	a.NotError(err).True(exists)
}
