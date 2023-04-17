// SPDX-License-Identifier: MIT

package linkage

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	id := "test"
	a.NotError(Install(s.Server, id, s.DB()))

	exists, err := s.DB().SQLBuilder().TableExists().Table(id + "_linkages").Exists()
	a.NotError(err).True(exists)
}

type object struct {
	Name string
	Age  int
}

var installData = &Item[*object]{
	Data: &object{Name: "root", Age: 0},
	Items: []*Item[*object]{
		{
			Data: &object{Name: "p1", Age: 1},
		}, {

			Data: &object{Name: "p2", Age: 2},
			Items: []*Item[*object]{
				{
					Data: &object{Name: "p21", Age: 21},
				},
				{
					Data: &object{Name: "p22", Age: 22},
				},
			},
		},
	},
}

func TestRoot_Install(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()

	id := "test"
	Install(s.Server, id, s.DB())
	l := New(s.Server, id, s.DB())

	k1 := NewRoot[*object](l, "k1", nil)
	a.NotError(k1.Install(installData))
	a.ErrorString(k1.Install(installData), "非空对象，不能再次安装数据。")
	a.ErrorString(NewRoot[*object](l, "k1", nil).Install(installData), "已经存在同名的 key: k1")
	cnt, err := l.dbPrefix.DB(l.db).Where("key=?", "k1").Count(&linkageModel{})
	a.NotError(err).Equal(5, cnt)

	k2 := NewRoot[*object](l, "k2", nil)
	a.NotError(k2.Install(installData))
	cnt, err = l.dbPrefix.DB(l.db).Where("key=?", "k2").Count(&linkageModel{})
	a.NotError(err).Equal(5, cnt)
}
