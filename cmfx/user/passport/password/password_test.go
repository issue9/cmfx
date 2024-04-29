// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package password

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/inital/test"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

var _ passport.Adapter = &Password{}

func TestPassword(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("test")
	Install(mod)

	p := New(mod)
	a.NotNil(p)

	// Add
	a.NotError(p.Add(nil, 1024, "1024", "1024"))
	a.ErrorIs(p.Add(nil, 1024, "1024", "1024"), passport.ErrExists())

	// Valid
	uid, identity, ok := p.Valid("1024", "1024")
	a.True(ok).Empty(identity).Equal(uid, 1024)
	uid, identity, ok = p.Valid("1024", "pass") // 密码错误
	a.False(ok).Empty(identity).Equal(uid, 0)
	uid, identity, ok = p.Valid("not-exists", "pass") // 不存在
	a.False(ok).Equal(identity, "").Equal(uid, 0)

	// Change
	a.ErrorString(p.Change(nil, 1025, "1024", "1024"), "not found")
	a.ErrorIs(p.Change(nil, 1024, "1025", "1024"), passport.ErrUnauthorized())
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
