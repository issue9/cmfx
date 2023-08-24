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

	mod := s.NewModule("test")
	a.NotError(Install(mod))

	exists, err := s.DB().SQLBuilder().TableExists().Table(mod.ID() + "_linkages").Exists()
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

	mod := s.NewModule("test")
	Install(mod)
	l := New(mod)

	k1 := NewRoot[*object](l, "k1")
	a.NotError(k1.Install(installData))
	a.ErrorString(k1.Install(installData), "非空对象，不能再次安装数据。")
	a.ErrorString(NewRoot[*object](l, "k1").Install(installData), "已经存在同名的 key: k1")
	cnt, err := l.DBEngine(nil).Where("key=?", "k1").Count(&linkageModel{})
	a.NotError(err).Equal(5, cnt)

	k2 := NewRoot[*object](l, "k2")
	a.NotError(k2.Install(installData))
	cnt, err = l.DBEngine(nil).Where("key=?", "k2").Count(&linkageModel{})
	a.NotError(err).Equal(5, cnt)
}
