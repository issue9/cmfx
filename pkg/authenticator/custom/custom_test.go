// SPDX-License-Identifier: MIT

package custom

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/orm/v5"

	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/test"
)

var _ authenticator.Authenticator = &Func{}

func TestCustom(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	Install(suite.Server, m, suite.DB())

	f := New(suite.Server, orm.Prefix(m), suite.DB(), func(s1, s2 string) bool {
		return s1 == s2
	})
	a.NotNil(f)

	// Add
	a.NotError(f.Add(nil, 1024, "1024"))
	a.ErrorIs(f.Add(nil, 1024, "1024"), authenticator.ErrExists)

	// Valid
	uid, identity, ok := f.Valid("1024", "1024")
	a.True(ok).Equal(uid, 1024).Empty(identity)
	uid, identity, ok = f.Valid("1024", "1025")
	a.False(ok).Equal(uid, 0).Empty(identity)

	// Identity
	identity, ok = f.Identity(1024)
	a.True(ok).Equal(identity, "1024")
	identity, ok = f.Identity(10240)
	a.False(ok).Empty(identity)

	// Delete
	a.NotError(f.Delete(nil, 1024))
	a.NotError(f.Delete(nil, 1024)) // 多次删除
	uid, identity, ok = f.Valid("1024", "1024")
	a.False(ok).Equal(uid, 0).Equal(identity, "1024")
	identity, ok = f.Identity(1024) // 已删除
	a.False(ok).Empty(identity)
}
