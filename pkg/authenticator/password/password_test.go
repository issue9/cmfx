// SPDX-License-Identifier: MIT

package password

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/orm/v5"

	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/test"
)

var _ authenticator.Authenticator = &Password{}

func TestPassword(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	Install(suite.Server, m, suite.DB())

	p := New(suite.Server, orm.Prefix(m), suite.DB())
	a.NotNil(p)

	// Add
	a.NotError(p.Add(nil, 1024, "1024", "1024"))
	a.ErrorIs(p.Add(nil, 1024, "1024", "1024"), authenticator.ErrExists)

	// Valid
	uid, identity, ok := p.Valid("1024", "1024")
	a.True(ok).Empty(identity).Equal(uid, 1024)
	uid, identity, ok = p.Valid("1024", "pass") // 密码错误
	a.False(ok).Empty(identity).Equal(uid, 0)
	uid, identity, ok = p.Valid("not-exists", "pass") // 不存在
	a.False(ok).Equal(identity, "").Equal(uid, 0)

	// Change
	a.ErrorString(p.Change(nil, 1025, "1024", "1024"), "not found")
	a.ErrorIs(p.Change(nil, 1024, "1025", "1024"), authenticator.ErrUnauthorized)
	a.NotError(p.Change(nil, 1024, "1024", "1025"))
	uid, identity, ok = p.Valid("1024", "1025")
	a.True(ok).Empty(identity).Equal(uid, 1024)

	// Identity
	identity, ok = p.Identity(1024)
	a.True(ok).Equal(identity, "1024")
	identity, ok = p.Identity(10240)
	a.False(ok).Empty(identity)

	// Delete
	a.NotError(p.Delete(nil, 1024))
	a.NotError(p.Delete(nil, 1024)) // 多次删除
	uid, identity, ok = p.Valid("1024", "1025")
	a.False(ok).Equal(identity, "").Zero(uid) // 已删
	identity, ok = p.Identity(1024)
	a.False(ok).Empty(identity)
}
