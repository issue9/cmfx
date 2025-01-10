// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package eav

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
	Install(mod, "eav")

	suite.TableExists(mod.ID() + "_eav_attrs").
		TableExists(mod.ID() + "_eav_values_int").
		TableExists(mod.ID() + "_eav_values_string").
		TableExists(mod.ID() + "_eav_values_datetime").
		TableExists(mod.ID() + "_eav_values_float")
}

func TestModule_Attribute(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	m := Install(mod, "eav")

	id, err := m.AddAttribute("name")
	a.NotError(err).Equal(id, 1)

	name, err := m.GetAttribute(id)
	a.NotError(err).Equal(name, "name")

	name, err = m.GetAttribute(10000)
	a.NotError(err).Equal(name, "")

	attrs, err := m.GetAttributes()
	a.NotError(err).Equal(attrs, []*AttributeVO{{ID: id, Name: "name"}})

	a.NotError(m.SetAttribute(id, "name1"))
	name, err = m.GetAttribute(id)
	a.NotError(err).Equal(name, "name1")
	attrs, err = m.GetAttributes()
	a.NotError(err).Equal(attrs, []*AttributeVO{{ID: id, Name: "name1"}})

	id, err = m.AddAttribute("name")
	a.NotError(err).Equal(id, 2)
	attrs, err = m.GetAttributes()
	a.NotError(err).Equal(attrs, []*AttributeVO{{ID: 1, Name: "name1"}, {ID: 2, Name: "name"}})

	a.NotError(m.DelAttribute(1))
	attrs, err = m.GetAttributes()
	a.NotError(err).Equal(attrs, []*AttributeVO{{ID: 2, Name: "name"}})
}

func TestValues(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	m := Install(mod, "eav")

	attr, err := m.AddAttribute("name")
	a.NotError(err).Equal(attr, 1)

	id, err := AddValue[int64](m, 1, attr, 5)
	a.NotError(err).Equal(id, 1)
	id, err = AddValue[int64](m, 1, attr, 6)
	a.NotError(err).Equal(id, 2)

	// GetValue

	val, err := GetValue[int64](m, id)
	a.NotError(err).Equal(val, 6)

	val, err = GetValue[int64](m, 10000)
	a.NotError(err).Equal(val, 0)

	// GetValues

	ints, err := GetValues[int64](m, 1, attr)
	a.NotError(err).Equal(ints, []*ValueVO[int64]{{ID: 1, Value: 5}, {ID: 2, Value: 6}})

	// SetValue

	a.NotError(SetValue[int64](m, 1, 7))
	ints, err = GetValues[int64](m, 1, attr)
	a.NotError(err).Equal(ints, []*ValueVO[int64]{{ID: 1, Value: 7}, {ID: 2, Value: 6}})

	// DelValue

	a.NotError(DelValue[int64](m, 1))
	ints, err = GetValues[int64](m, 1, attr)
	a.NotError(err).Equal(ints, []*ValueVO[int64]{{ID: 2, Value: 6}})
}
