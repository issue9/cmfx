// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package totp

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

func TestTOTP(t *testing.T) {
	a := assert.New(t, false)

	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("test")
	Install(mod, "totp")
	p := New(mod, "totp", web.Phrase("totp"))

	// Add

	a.NotError(p.Add(1024, "1024", "1024", time.Now()))
	a.ErrorIs(p.Add(1024, "1024", "1024", time.Now()), passport.ErrUIDExists())
	a.ErrorIs(p.Add(1000, "1024", "1024", time.Now()), passport.ErrIdentityExists())

	a.NotError(p.Add(0, "2025", "2025", time.Now()))
	a.NotError(p.Add(0, "2026", "2026", time.Now()))
	a.ErrorIs(p.Add(111, "1024", "1024", time.Now()), passport.ErrIdentityExists()) // 1024 已经有 uid
	a.NotError(p.Add(2025, "2025", "2025", time.Now()))                             // 将 "2025" 关联 uid

	// Identity

	identity, err := p.Identity(1024)
	a.NotError(err).Equal(identity, "1024")
	identity, err = p.Identity(10240)
	a.Equal(err, passport.ErrUIDNotExists()).Empty(identity)

	// uid

	uid, err := p.UID("1024")
	a.NotError(err).Equal(uid, 1024)
	uid, err = p.UID("10240")
	a.Equal(err, passport.ErrIdentityNotExists()).Zero(identity)
	uid, err = p.UID("2025")
	a.NotError(err).Zero(identity)

	// Delete

	a.NotError(p.Delete(1024)).
		NotError(p.Delete(1024)) // 多次删除
	identity, err = p.Identity(1024)
	a.Equal(err, passport.ErrUIDNotExists()).Empty(identity)

	// Update

	a.NotError(p.Update(1025))
	a.NotError(p.Update(1024))
}
