// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package linkages

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
	m := Install(mod, "lk", &LinkageVO{
		Title: "t1",
		Icon:  "icon1",
		Items: []*LinkageVO{
			{Title: "t2", Icon: "icon2"},
			{Title: "t3", Icon: "icon3"},
		},
	})

	t.Run("Get", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).
			Equal(root.Title, "t1").
			Length(root.Items, 2)
	})

	t.Run("Add", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		a.NotError(m.Add(root.ID, "t4", "icon4", 5))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Length(root.Items, 3)

		item := root.Items[0]
		a.NotError(m.Add(item.ID, "t5", "icon5", 5))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Length(root.Items, 3).
			Equal(root.Items[0].Items[0].Title, "t5")
	})

	t.Run("Set", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		item := root.Items[0]
		a.NotError(m.Set(item.ID, "t55", "icon55", 5))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Equal(root.Items[0].Title, "t55").
			Equal(root.Items[0].Icon, "icon55")
	})

	t.Run("Delete", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		item := root.Items[0]
		a.NotError(m.Delete(item.ID))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Length(root.Items, 2)
	})
}
