// SPDX-License-Identifier: MIT

package passport

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestPassport_Func(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	a.NotError(Install(m, suite.DB()))

	p := New(m, suite.DB())
	a.NotNil(p)

	f := p.Func("t1", func(s1, s2 string) bool {
		return s1 == s2
	})
	a.NotNil(f)

	// Add
	a.NotError(f.Add(nil, 1024, "1024"))
	a.ErrorIs(f.Add(nil, 1024, "1024"), ErrExists)

	// Valid
	uid, err := f.Valid(nil, "1024", "1024")
	a.NotError(err).Equal(uid, 1024)
	uid, err = f.Valid(nil, "1024", "1025")
	a.Error(err, ErrUnauthorized).Equal(uid, 0)

	// Delete
	a.NotError(f.Delete(nil, 1024))
	a.NotError(f.Delete(nil, 1024)) // 多次删除
	uid, err = f.Valid(nil, "1024", "1024")
	a.ErrorString(err, "不存在").Equal(uid, 0)
}
