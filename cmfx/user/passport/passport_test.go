// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package passport_test

import (
	"maps"
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

	password.Install(mod1, "password1")
	password.Install(mod2, "password2")

	p := passport.New(suite.Module())
	a.NotNil(p).
		Length(maps.Collect(p.All(suite.Module().Server().Locale().Printer())), 0)

	// Register

	p1 := password.New(mod1, "password1", 5, web.Phrase("password1"))
	p.Register(p1)
	a.Equal(p.Get("password1"), p1)

	p2 := password.New(mod2, "password2", 5, web.Phrase("password2"))
	p.Register(p2)
	a.Equal(p.Get("password2"), p2)

	a.PanicString(func() {
		p.Register(password.New(mod1, "password1", 5, web.Phrase("password")))
	}, "已经存在同名 password1 的验证器")

	a.Length(maps.Collect(p.All(suite.Module().Server().Locale().Printer())), 2)

	// Valid / Identities

	uid, identity, ok := p.Valid("password1", "1024", "1024", time.Now())
	a.False(ok).Equal(identity, "").Zero(uid)
	a.Empty(maps.Collect(p.Identities(1024)))

	// p1.Add
	a.NotError(p1.Add(1024, "1024", "1024", time.Now()))
	uid, identity, ok = p.Valid("password1", "1024", "1024", time.Now())
	a.True(ok).Equal(identity, "1024").Equal(uid, 1024)
	a.Equal(maps.Collect(p.Identities(1024)), map[string]string{"password1": "1024"})

	// p2.Add
	a.NotError(p2.Add(1024, "1024", "1024", time.Now()))
	uid, identity, ok = p.Valid("password2", "1024", "not match", time.Now())
	a.Zero(identity).Zero(uid).False(ok)
	a.Equal(maps.Collect(p.Identities(1024)), map[string]string{"password1": "1024", "password2": "1024"})

	// p.DeleteUser

	a.NotError(p.ClearUser(1111)) // 不存在该用户
	a.NotError(p.ClearUser(1024))
	a.Empty(maps.Collect(p.Identities(1024)))
}
