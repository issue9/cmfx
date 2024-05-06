// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package password

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/adaptertest"
)

var _ passport.Adapter = &password{}

func TestPassword(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("test")
	Install(mod)

	p := New(mod, 11)
	a.NotNil(p)

	adaptertest.Run(a, p)
}

func TestValidIdentity(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("test")
	Install(mod)

	p := New(mod, 11)
	a.NotNil(p)

	a.ErrorIs(p.Add(1024, "", "1024", time.Now()), passport.ErrInvalidIdentity())
	a.ErrorIs(p.Add(1024, "//", "1024", time.Now()), passport.ErrInvalidIdentity())
	a.NotError(p.Add(1024, "1024", "1024", time.Now()))
	a.NotError(p.Add(1025, "abcd", "1024", time.Now()))
}
