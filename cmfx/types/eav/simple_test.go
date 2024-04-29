// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/inital/test"
)

type people struct {
	ID   int
	Name string
	age  int
}

func TestSimple(t *testing.T) {
	a := assert.New(t, false)

	suite := test.NewSuite(a)
	defer suite.Close()
	tableName := "eav"
	mod := suite.NewModule("test")
	InstallSimple(mod, tableName)

	// insert

	simple := NewSimple[people](mod, tableName, nil, nil)
	a.NotNil(simple)
	a.NotError(simple.Insert(1, &people{ID: 1, Name: "1", age: 5}))
	a.Error(simple.Insert(1, &people{ID: 2, Name: "2", age: 5})) // 相同的 id 参数

	// select

	p := &people{}
	found, err := simple.Select(1, p)
	a.NotError(err).True(found).
		Equal(p.age, 0). // 小写，不会去写入数据库
		Equal(p.ID, 1).
		Equal(p.Name, "1")

	found, err = simple.Select(2, p)
	a.NotError(err).False(found)

	// update

	a.NotError(simple.Update(1, &people{ID: 2}))
	p = &people{}
	found, err = simple.Select(1, p)
	a.NotError(err).True(found).
		Equal(p.age, 0).
		Equal(p.ID, 2).
		Equal(p.Name, "")

		// delete

	a.NotError(simple.Delete(1))
	p = &people{}
	found, err = simple.Select(1, p)
	a.NotError(err).False(found)
}
