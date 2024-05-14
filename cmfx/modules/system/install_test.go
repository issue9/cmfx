// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	adminL := admintest.NewAdmin(s)

	conf := &Config{}
	s.Assertion().NotError(conf.SanitizeConfig())
	mod := s.NewModule("mod")

	l := Install(mod, conf, adminL)
	a.NotNil(l)

	s.TableExists("mod_linkages").TableExists("mod_api_healths")
}

func TestInstallLinkage(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	sys := newSystem(s)

	err := InstallLinkage[string](sys, "sex", "SEX", nil)
	a.NotError(err)
	size, err := sys.mod.DB().Where("key=?", "sex").AndIsNull("deleted").Count(&modelLinkage{})
	a.NotError(err).Equal(size, 1)

	a.PanicString(func() {
		_ = InstallLinkage[string](sys, "sex", "SEX", nil)
	}, "已经存在同名的级联数据")

	a.NotError(DeleteLinkage(sys, "sex"))
	size, err = sys.mod.DB().Where("key=?", "sex").AndIsNull("deleted").Count(&modelLinkage{})
	a.NotError(err).Equal(size, 0)

	err = InstallLinkage(sys, "sex", "SEX", []*LinkageItem[string]{
		{Data: "male"},
		{Data: "female"},
		{Data: "other"},
	})
	a.NotError(err)
	size, err = sys.mod.DB().Where("key=?", "sex").AndIsNull("deleted").Count(&modelLinkage{})
	a.NotError(err).Equal(size, 4)

	a.NotError(DeleteLinkage(sys, "sex"))
	size, err = sys.mod.DB().Where("key=?", "sex").AndIsNull("deleted").Count(&modelLinkage{})
	a.NotError(err).Equal(size, 0) // 所有相同 key 都会被标记为删除

	// 有子项的数据

	err = InstallLinkage(sys, "sex", "SEX", []*LinkageItem[string]{
		{Data: "male"},
		{Data: "female"},
		{Data: "other", Items: []*LinkageItem[string]{
			{Data: "male"},
			{Data: "female"},
			{Data: "other", Items: []*LinkageItem[string]{
				{Data: "male"},
				{Data: "female"},
			}},
		}},
	})
	a.NotError(err)
	size, err = sys.mod.DB().Where("key=?", "sex").AndIsNull("deleted").Count(&modelLinkage{})
	a.NotError(err).Equal(size, 9)

	a.NotError(DeleteLinkage(sys, "sex"))
	size, err = sys.mod.DB().Where("key=?", "sex").AndIsNull("deleted").Count(&modelLinkage{})
	a.NotError(err).Equal(size, 0) // 所有相同 key 都会被标记为删除
}
