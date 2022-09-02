// SPDX-License-Identifier: MIT

package system

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestLinkage(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	sys, _ := newSystem(suite)

	l := sys.Linkage()
	a.NotNil(l)

	// AddItems
	a.NotError(l.AddItems())
	a.NotError(l.AddItems("a", "b", "c"))

	// GetItem
	la := l.GetItem(1)
	a.NotNil(la).Equal(la.name, "a")
	a.Nil(l.GetItem(100)) // 只有三条数据，应该到不了 100

	// AddItem
	a.NotError(la.AddItems("a1", "a2"))
	la3, err := la.AddItem("a3")
	a.NotError(err).NotNil(la3)
	a.Equal(3, len(la.items))

	// SetItem
	a.NotError(la.SetItem(la3.ID(), "a33"))
	a.Equal(la.GetItem(la3.ID()).name, "a33")
	item := &linkage{ID: la3.ID()}
	found, err := sys.dbPrefix.DB(sys.db).Select(item)
	a.NotError(err).True(found)
	a.Equal(item.Name, "a33") // 已写入数据库

	// DeleteItem
	la3ID := la3.ID()
	a.NotError(la.DeleteItem(la3ID))
	a.Nil(la.GetItem(la3ID))
	item = &linkage{ID: la3ID}
	found, err = sys.dbPrefix.DB(sys.db).Select(item)
	a.NotError(err).
		True(found).
		True(item.Deleted.Valid)
	a.ErrorString(l.DeleteItem(la.ID()), "包含子元素")
}
