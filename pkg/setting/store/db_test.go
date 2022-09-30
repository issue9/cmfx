// SPDX-License-Identifier: MIT

package store

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

type object struct {
	ID   string
	Name string
}

func TestDB(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	mod := "test"

	Install(mod, s.DB())
	store := NewDB(mod, s.DB())

	exists, err := store.Exists("id")
	a.NotError(err).False(exists)

	a.PanicString(func() {
		obj := &object{}
		store.Load("id", obj)
	}, "不存在的数据 id")

	// 没有数据，但是更新不会返回错误
	a.NotError(store.Update("id", &object{}))

	a.NotError(store.Insert("id", &object{ID: "1", Name: "1"}))
	a.Error(store.Insert("id", &object{ID: "1", Name: "1"})) // 存在同名的

	// Load
	obj := &object{}
	a.NotError(store.Load("id", obj))
	a.Equal(obj.ID, "1").Equal(obj.Name, "1")

	exists, err = store.Exists("id")
	a.NotError(err).True(exists)

	a.NotError(store.Update("id", &object{ID: "2", Name: "2"}))
	obj = &object{}
	a.NotError(store.Load("id", obj))
	a.Equal(obj.ID, "2").Equal(obj.Name, "2")
}
