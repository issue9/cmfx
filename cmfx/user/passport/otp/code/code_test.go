// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/adaptertest"
)

var _ passport.Adapter = &code{}

func TestCode(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("test")
	Install(mod, "codes")

	p := New(mod, 5*time.Minute, "codes", nil, &sender{}, web.Phrase("desc"))
	a.NotNil(p)
	adaptertest.RunBase(a, p)

	p = New(mod, 5*time.Minute, "codes", nil, &sender{}, web.Phrase("desc"))
	a.NotError(p.Add(1024, "1024", "1024", time.Now()))
	adaptertest.RunUpdate(a, p)
}
