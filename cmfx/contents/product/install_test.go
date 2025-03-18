// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package product

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

	s.TableExists(prefix + "_product_snapshots").
		TableExists(prefix + "_products")
}
