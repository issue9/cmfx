// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package user_test

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/orm/v6/core"
	"github.com/issue9/web/openapi"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

var (
	_ core.PrimitiveTyper   = user.StateNormal
	_ openapi.OpenAPISchema = user.StateDeleted
)

func TestModule_Statistic(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	m := usertest.NewModule(suite)
	s, err := m.Statistic(time.Now())
	a.NotError(err).NotNil(s).Equal(s, &user.Statistic{
		All:   1,
		Month: 1,
		Week:  1,
		Day:   1,
	})
}
