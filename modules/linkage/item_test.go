// SPDX-License-Identifier: MIT

package linkage

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRoot(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	mod := s.NewModule("test")
	Install(mod)
	l := New(mod)

	k1 := NewRoot[*object](l, "k1")
	a.NotError(k1.Install(installData))
	cnt, err := l.DBEngine(nil).Where("key=?", "k1").Count(&linkageModel{})
	a.NotError(err).Equal(5, cnt)

	// Add
	a.NotError(k1.Add(0, &object{Name: "new1", Age: 1}))
	cnt, err = l.DBEngine(nil).Where("key=?", "k1").Count(&linkageModel{})
	a.NotError(err).Equal(6, cnt)
	n1 := k1.Items[2]
	a.Equal(n1.Data, &object{Name: "new1", Age: 1}).
		True(n1.ID > 0).
		Empty(n1.Items)

	a.NotError(k1.Add(n1.ID, &object{Name: "new2", Age: 12}))
	cnt, err = l.DBEngine(nil).Where("key=?", "k1").Count(&linkageModel{})
	a.NotError(err).Equal(7, cnt)
	n12 := n1.Items[0]
	a.Equal(n12.Data, &object{Name: "new2", Age: 12}).
		True(n12.ID > 0).
		Empty(n12.Items).
		Length(n1.Items, 1).
		Equal(n12.parent, n1.ID)

	// Update

	// Delete
}
