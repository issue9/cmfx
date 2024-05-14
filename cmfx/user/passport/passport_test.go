// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport_test

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/passport"
	"github.com/issue9/cmfx/cmfx/user/passport/password"
)

func TestPassport(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	mod1 := suite.NewModule("test_p1")
	mod2 := suite.NewModule("test_p2")

	password.Install(mod1)
	password.Install(mod2)

	p := passport.New(suite.Module())
	a.NotNil(p).
		Length(p.All(suite.Module().Server().Locale().Printer()), 0)

	// Register

	var p1 = password.New(mod1, 5)
	p.Register("p1", p1, web.Phrase("password"))
	a.Equal(p.Get("p1"), p1)

	p2 := password.New(mod2, 5)
	p.Register("p2", p2, web.Phrase("password"))
	a.Equal(p.Get("p2"), p2)

	a.PanicString(func() {
		p.Register("p1", p1, web.Phrase("password"))
	}, "已经存在同名 p1 的验证器")

	a.Length(p.All(suite.Module().Server().Locale().Printer()), 2)

	// Valid / Identities

	uid, identity, ok := p.Valid("p1", "1024", "1024", time.Now())
	a.False(ok).Equal(identity, "").Zero(uid)
	a.Empty(p.Identities(1024))

	// p1.Add
	a.NotError(p1.Add(1024, "1024", "1024", time.Now()))
	uid, identity, ok = p.Valid("p1", "1024", "1024", time.Now())
	a.True(ok).Equal(identity, "1024").Equal(uid, 1024)
	a.Equal(p.Identities(1024), map[string]string{"p1": "1024"})

	// p2.Add
	a.NotError(p2.Add(1024, "1024", "1024", time.Now()))
	uid, identity, ok = p.Valid("p2", "1024", "not match", time.Now())
	a.Zero(identity).Zero(uid).False(ok)
	a.Equal(p.Identities(1024), map[string]string{"p1": "1024", "p2": "1024"})
}
