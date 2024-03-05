// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package authenticator_test

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/authenticator/password"
	"github.com/issue9/cmfx/pkg/test"
)

func TestAuthenticators(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	mod1 := suite.NewModule("test_p1")
	mod2 := suite.NewModule("test_p2")

	password.Install(mod1)
	password.Install(mod2)

	auth := authenticator.NewAuthenticators(suite.Server, time.Minute, web.Phrase("gc"))
	a.NotNil(auth)
	a.Length(auth.All(suite.Server.Locale().Printer()), 0)

	// Register

	p1 := password.New(mod1)
	auth.Register("p1", p1, web.Phrase("password"))

	p2 := password.New(mod2)
	auth.Register("p2", p2, web.Phrase("password"))

	a.PanicString(func() {
		auth.Register("p1", p1, web.Phrase("password"))
	}, "已经存在同名 p1 的验证器")

	a.Length(auth.All(suite.Server.Locale().Printer()), 2)

	// Valid / Identities

	uid, identity, ok := auth.Valid("p1", "1024", "1024")
	a.False(ok).Equal(identity, "").Zero(uid)
	a.Empty(auth.Identities(1024))

	// p1.Add
	p1.Add(nil, 1024, "1024", "1024")
	uid, identity, ok = auth.Valid("p1", "1024", "1024")
	a.True(ok).Zero(identity).Equal(uid, 1024)
	a.Equal(auth.Identities(1024), map[string]string{"p1": "1024"})

	// p2.Add
	p2.Add(nil, 1024, "1024", "1024")
	uid, identity, ok = auth.Valid("p2", "1024", "not match")
	a.Zero(identity).Zero(uid).False(ok)
	a.Equal(auth.Identities(1024), map[string]string{"p1": "1024", "p2": "1024"})
}
