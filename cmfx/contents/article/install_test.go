// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)

	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("test")
	Install(mod, "abc")
	prefix := mod.ID() + "_" + "abc"

	s.TableExists(prefix + "_article_snapshots").
		TableExists(prefix + "_articles").
		TableExists(prefix + "_" + tagsTableName).
		TableExists(prefix + "_" + topicsTableName)
}
