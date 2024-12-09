// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

func TestLoad(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	u := usertest.NewModule(s)

	Install(u, "point")
	m := Load(u, "point")

	size, err := m.db.Where("true").Count(&overviewPO{})
	a.NotError(err).Zero(size) // 先安装的 user，再安装的 currency，不会自动添加 overviewPO 表。

	id, err := u.New(user.StateNormal, "u2", "123", "", "", "add")
	a.NotError(err).NotZero(id)

	a.Wait(time.Millisecond * 500) // 待 Load 完成数据库插入 overview
	size, err = m.db.Where("true").Count(&overviewPO{})
	a.NotError(err).Equal(size, 1)
}
