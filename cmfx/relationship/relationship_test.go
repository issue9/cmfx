// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package relationship

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install[string, int](mod, "t1_t2")

	suite.TableExists(mod.ID() + "_t1_t2_relationships")
}

func TestModule(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("rbac")
	m := Install[string, int](mod, "t1_t2")

	// Add

	a.NotError(m.Add(nil, "v", 1))
	a.NotError(m.Add(nil, "v", 2))
	a.NotError(m.Add(nil, "v", 3))

	// Count

	cnt, err := m.CountByV1("v")
	a.NotError(err).Equal(cnt, 3)

	cnt, err = m.CountByV2(3)
	a.NotError(err).Equal(cnt, 1)

	cnt, err = m.CountByV2(100)
	a.NotError(err).Equal(cnt, 0)

	// List

	list1, err := m.ListV1(2)
	a.NotError(err).Equal(list1, []string{"v"})

	list2, err := m.ListV2("v")
	a.NotError(err).Equal(list2, []int{1, 2, 3})

	list2, err = m.ListV2("vv") // 不存在的数据
	a.NotError(err).Equal(list2, []int{})

	// Delete

	a.NotError(m.Delete(nil, "v", 1))
	cnt, err = m.CountByV1("v")
	a.NotError(err).Equal(cnt, 2) // 删除了一条

	a.NotError(m.Delete(nil, "vv", 2)) // 不存在
	cnt, err = m.CountByV1("v")
	a.NotError(err).Equal(cnt, 2)

	a.NotError(m.DeleteByV2(nil, 2))
	cnt, err = m.CountByV1("v")
	a.NotError(err).Equal(cnt, 1)

	a.NotError(m.DeleteByV1(nil, "v"))
	cnt, err = m.CountByV1("v")
	a.NotError(err).Equal(cnt, 0)
}
