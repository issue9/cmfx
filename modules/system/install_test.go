// SPDX-License-Identifier: MIT

package system

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/orm/v5"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstaller(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)

	id := "test"
	i := Install(id, s.DB())
	s.Assertion().NotNil(i)
	p := orm.Prefix(id)

	exists, err := s.DB().SQLBuilder().TableExists().Table(id + "_linkages").Exists()
	a.NotError(err).True(exists)

	err = i.Linkage().AddItems("a", "b", "c")
	a.NotError(err)

	items := make([]*linkage, 0, 5)
	size, err := s.DB().SQLBuilder().Select().
		Where("deleted IS NULL").
		From(p.TableName(&linkage{})).
		QueryObject(true, &items)
	a.NotError(err).Equal(size, 3).
		Equal(3, len(i.Linkage().items))
}
