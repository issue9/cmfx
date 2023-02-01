// SPDX-License-Identifier: MIT

package authenticator_test

import (
	"testing"
	"time"

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
	password.Install(suite.Server(), mod+"_p1", suite.DB())
	password.Install(suite.Server(), mod+"_p2", suite.DB())

	auth := authenticator.NewAuthenticators(suite.Server(), time.Minute, "gc")
	a.NotNil(auth)
	a.Length(auth.All(suite.Server().LocalePrinter()), 0)

	// Register

	p1 := password.New(suite.Server(), orm.Prefix(mod+"_p1"), suite.DB())
	auth.Register("p1", p1, web.Phrase("password"))

	p2 := password.New(suite.Server(), orm.Prefix(mod+"_p2"), suite.DB())
	auth.Register("p2", p2, web.Phrase("password"))

	a.PanicString(func() {
		auth.Register("p1", p1, web.Phrase("password"))
	}, "已经存在同名 p1 的验证器")

	a.Length(auth.All(suite.Server().LocalePrinter()), 2)

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
