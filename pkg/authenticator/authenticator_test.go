// SPDX-License-Identifier: MIT

package authenticator_test

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/authenticator/password"
	"github.com/issue9/cmfx/pkg/test"
)

func TestAuthenticators(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	mod := "test"
	password.Install(mod+"_p1", suite.DB())
	password.Install(mod+"_p2", suite.DB())

	auth := authenticator.NewAuthenticators(5)
	a.NotNil(auth)
	a.Length(auth.All(suite.Server().LocalePrinter()), 0)

	// Register

	p1 := password.New(suite.Server(), orm.Prefix(mod+"_p1"), suite.DB())
	auth.Register("p1", p1, web.Phrase("password"), "https://example.com/logo.png")

	p2 := password.New(suite.Server(), orm.Prefix(mod+"_p2"), suite.DB())
	auth.Register("p2", p2, web.Phrase("password"), "https://example.com/logo.png")

	a.PanicString(func() {
		auth.Register("p1", p1, web.Phrase("password"), "https://example.com/logo.png")
	}, "已经存在同名 p1 的验证器")

	a.Length(auth.All(suite.Server().LocalePrinter()), 2)

	// Valid / Identities

	uid, ok := auth.Valid("p1", "1024", "1024")
	a.False(ok).Zero(uid)
	a.Empty(auth.Identities(1024))

	// p1.Add
	p1.Add(nil, 1024, "1024", "1024")
	uid, ok = auth.Valid("p1", "1024", "1024")
	a.True(ok).Equal(uid, 1024)
	a.Equal(auth.Identities(1024), map[string]string{"p1": "1024"})

	// p2.Add
	p2.Add(nil, 1024, "1024", "1024")
	uid, ok = auth.Valid("p2", "1024", "not match")
	a.False(ok).Zero(uid)
	a.Equal(auth.Identities(1024), map[string]string{"p1": "1024", "p2": "1024"})
}
