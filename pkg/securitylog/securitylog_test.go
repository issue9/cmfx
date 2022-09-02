// SPDX-License-Identifier: MIT

package securitylog

import (
	"testing"
	"time"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestSecurityLog(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := suite.NewModule("test")
	a.NotError(Install(m, suite.DB()))

	l := New(m, suite.DB())
	a.NotNil(l)
	a.NotError(l.Add(1, "127.0.0.0", "firefox", "change password"))
	a.NotError(l.Add(1, "127.0.0.1", "chrome", "change username"))
	logs, err := l.Get(1, 5, 0, "", time.Time{}, time.Time{})
	a.NotError(err).
		Equal(2, len(logs.Logs)).
		Equal(2, logs.Count)

	logs, err = l.Get(1, 1, 0, "", time.Time{}, time.Time{})
	a.NotError(err).
		Equal(1, len(logs.Logs)).
		Equal(2, logs.Count)

	// 不存在的 uid
	logs, err = l.Get(2, 5, 0, "", time.Time{}, time.Time{})
	a.NotError(err).
		Equal(0, len(logs.Logs)).
		Equal(0, logs.Count)
}
