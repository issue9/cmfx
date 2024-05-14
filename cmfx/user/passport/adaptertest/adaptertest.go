// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// adaptertest 提供了针对 [passport.Adapter] 的测试用例
package adaptertest

import (
	"time"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/user/passport"
)

// Run 测试 p 的基本功能
func Run(a *assert.Assertion, p passport.Adapter) {
	// Add

	a.NotError(p.Add(1024, "1024", "1024", time.Now()))
	a.ErrorIs(p.Add(1024, "1024", "1024", time.Now()), passport.ErrUIDExists())
	a.ErrorIs(p.Add(1000, "1024", "1024", time.Now()), passport.ErrIdentityExists())

	a.NotError(p.Add(0, "2025", "2025", time.Now()))
	a.NotError(p.Add(0, "2026", "2026", time.Now()))
	a.ErrorIs(p.Add(111, "1024", "1024", time.Now()), passport.ErrIdentityExists()) // 1024 已经有 uid
	a.NotError(p.Add(2025, "2025", "2025", time.Now()))                             // 将 "2025" 关联 uid

	// Valid

	uid, identity, err := p.Valid("1024", "1024", time.Now())
	a.NotError(err).Equal(identity, "1024").Equal(uid, 1024)
	uid, identity, err = p.Valid("1024", "pass", time.Now()) // 密码错误
	a.Equal(err, passport.ErrUnauthorized()).Empty(identity).Equal(uid, 0)
	uid, identity, err = p.Valid("not-exists", "pass", time.Now()) // 不存在
	a.Equal(err, passport.ErrUnauthorized()).Equal(identity, "").Equal(uid, 0)

	// Change

	a.ErrorIs(p.Change(1025, "1024", "1024"), passport.ErrUIDNotExists())
	a.ErrorIs(p.Change(1024, "1025", "1024"), passport.ErrUnauthorized())
	a.NotError(p.Change(1024, "1024", "1025"))
	uid, identity, err = p.Valid("1024", "1025", time.Now())
	a.NotError(err).Equal(identity, "1024").Equal(uid, 1024)

	// Identity

	identity, err = p.Identity(1024)
	a.NotError(err).Equal(identity, "1024")
	identity, err = p.Identity(10240)
	a.Equal(err, passport.ErrUIDNotExists()).Empty(identity)

	// Delete

	a.NotError(p.Delete(1024)).
		NotError(p.Delete(1024)) // 多次删除
	uid, identity, err = p.Valid("1024", "1025", time.Now())
	a.Equal(err, passport.ErrUnauthorized()).Equal(identity, "").Zero(uid) // 已删
	identity, err = p.Identity(1024)
	a.Equal(err, passport.ErrUIDNotExists()).Empty(identity)
}
