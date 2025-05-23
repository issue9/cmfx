// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/locales"
)

func TestModule(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("lk")
	m := Install(mod, "lk", &Linkage{
		Title: "t1",
		Icon:  "icon1",
		Order: 5,
		Items: []*Linkage{
			{Title: "t2", Icon: "icon2", Order: 5},
			{Title: "t3", Icon: "icon3", Order: 5},
		},
	})

	t.Run("Get", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).
			Equal(root.Title, "t1").
			Length(root.Items, 2)
	})

	t.Run("AddCount", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		a.NotError(m.AddCount(root.ID, 1))
		root, err = m.Get()
		a.NotError(err).Equal(root.Count, 1)

		a.NotError(m.AddCount(root.Items[0].ID, 2))
		root, err = m.Get()
		a.NotError(err).Equal(root.Items[0].Count, 2)
	})

	t.Run("Add", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		item := root.Items[0]
		a.NotError(m.Add(item.ID, "t5", "icon5", 5))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Length(root.Items, 2).
			Equal(root.Items[0].Items[0].Title, "t5")

		a.NotError(m.Add(root.ID, "t4", "icon4", 5))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Length(root.Items, 3)
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

		a.NotError(m.Set(root.ID, "t66", "icon55", 5))
		root, err = m.Get()
		a.NotError(err).Equal(root.Title, "t66")
	})

	t.Run("Delete", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		a.Equal(m.Delete(0), locales.ErrNotFound())
		a.Equal(m.Delete(root.ID), locales.ErrInvalidValue())

		item := root.Items[0]
		a.NotError(m.Delete(item.ID))
		root, err = m.Get()
		a.NotError(err).
			NotNil(root).
			Length(root.Items, 2)
	})

	t.Run("Validator", func(t *testing.T) {
		root, err := m.Get()
		a.NotError(err).NotNil(root)

		a.True(m.Validator(root.Items[0].ID)).
			False(m.Validator(100))
	})
}
