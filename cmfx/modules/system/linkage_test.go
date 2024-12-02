// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/sliceutil"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestLinkage(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	sys := newModule(s)

	err := InstallLinkage(sys, "sex", "SEX", []*LinkageItem[string]{
		{Data: "male"},
		{Data: "female"},
		{Data: "other", Items: []*LinkageItem[string]{
			{Data: "male"},
			{Data: "female"},
			{Data: "other"},
		}},
	})
	a.NotError(err)

	l, err := LoadLinkage[string](sys, "sex")
	a.NotError(err).NotNil(l).
		Equal(l.Key(), "sex").
		Equal(l.Title(), "SEX").
		Length(l.Items(), 3)

	other, found := sliceutil.At(l.Items(), func(i *LinkageItem[string], _ int) bool { return i.Data == "other" })
	a.True(found).NotNil(other).Length(other.Items, 3)

	other2, found := sliceutil.At(other.Items, func(i *LinkageItem[string], _ int) bool { return i.Data == "other" })
	a.True(found).NotNil(other2).Length(other2.Items, 0)

	// findByID

	parent, curr := l.findByID(other2.ID)
	a.Equal(curr, other2).
		Equal(parent, other)

	parent, curr = l.findByID(other.ID)
	a.Equal(curr, other).Nil(parent)

	parent, curr = l.findByID(1000) // 不存在
	a.Nil(curr).
		Nil(parent)

	// Set

	a.NotError(l.Set(other.ID, "text"))
	curr = l.Get(other.ID)
	a.NotNil(curr).Equal(curr.Data, "text")
	mod := &linkagePO{ID: other.ID}
	size, err := sys.mod.DB().Where("id=?", other.ID).AndIsNull("deleted").Select(true, mod)
	a.NotError(err).Equal(size, 1)

	// delete

	a.NotError(l.Delete(other2.ID))
	size, err = sys.mod.DB().Where("id=?", other2.ID).AndIsNull("deleted").Select(true, mod)
	a.NotError(err).Equal(size, 0)
	curr = l.Get(other2.ID)
	a.Nil(curr)
	curr = l.Get(other.ID)
	a.Length(curr.Items, 2) // 父元素的子元素减少

	// Add

	item, err := l.Add("other3", other.ID)
	a.NotError(err).NotNil(item).Equal(item.Data, "other3")
	curr = l.Get(other.ID) // 父元素
	a.NotNil(curr).Length(curr.Items, 3)
	curr = l.Get(item.ID)
	a.NotNil(curr).Length(curr.Items, 0).Equal(item.Data, "other3")

	item, err = l.Add("root", 0)
	a.NotError(err).NotNil(item).Equal(item.Data, "root").
		Length(l.Items(), 4)
}
