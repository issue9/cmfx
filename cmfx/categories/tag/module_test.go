// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package tag

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestModule(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("lk")
	m := Install(mod, "lk", "t1", "t2")

	t.Run("Get", func(t *testing.T) {
		list, err := m.Get()
		a.NotError(err).
			Length(list, 2)
	})

	t.Run("Add", func(t *testing.T) {
		list, err := m.Get()
		a.NotError(err).NotNil(list)

		a.NotError(m.Add("t3", "t4"))
		list, err = m.Get()
		a.NotError(err).
			NotNil(list).
			Length(list, 4)

		a.NotError(m.Add("t5"))
		list, err = m.Get()
		a.NotError(err).
			NotNil(list).
			Length(list, 5)
	})

	t.Run("Set", func(t *testing.T) {
		list, err := m.Get()
		a.NotError(err).NotNil(list)

		item := list[0]
		a.NotError(m.Set(item.ID, "t55"))
		list, err = m.Get()
		a.NotError(err).
			NotNil(list).
			Equal(list[0].Title, "t55")
	})

	t.Run("Validator", func(t *testing.T) {
		a.True(m.Validator(1)).False(m.Validator(100))
	})
}

func TestModule_empty(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("lk")
	m := Install(mod, "lk")

	list, err := m.Get()
	a.NotError(err).
		Length(list, 0)

	list, err = m.Get()
	a.NotError(err).NotNil(list)

	a.NotError(m.Add("t3", "t4"))
	list, err = m.Get()
	a.NotError(err).
		NotNil(list).
		Length(list, 2)
}
