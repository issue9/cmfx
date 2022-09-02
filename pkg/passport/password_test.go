// SPDX-License-Identifier: MIT

package passport

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestPassport_Password(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := suite.NewModule("test")
	a.NotError(Install(m, suite.DB()))

	p := New(m, suite.DB())
	a.NotNil(p)

	pp := p.Password("t1")
	a.NotNil(pp)

	// Add
	a.NotError(pp.Add(nil, 1024, "1024", "1024"))
	a.ErrorIs(pp.Add(nil, 1024, "1024", "1024"), ErrExists)

	// Valid
	uid, err := pp.Valid(nil, "1024", "1024")
	a.NotError(err).Equal(uid, 1024)
	uid, err = pp.Valid(nil, "1024", "pass")
	a.ErrorIs(err, ErrUnauthorized).Equal(uid, 0)

	// Change
	a.ErrorString(pp.Change(nil, 1025, "1024", "1024"), "不存在")
	a.ErrorIs(pp.Change(nil, 1024, "1025", "1024"), ErrUnauthorized)
	a.NotError(pp.Change(nil, 1024, "1024", "1025"))
	uid, err = pp.Valid(nil, "1024", "1025")
	a.NotError(err).Equal(uid, 1024)

	// Delete
	a.NotError(pp.Delete(nil, 1024))
	a.NotError(pp.Delete(nil, 1024)) // 多次删除
	uid, err = pp.Valid(nil, "1024", "1025")
	a.ErrorString(err, "不存在").Zero(uid)
}
