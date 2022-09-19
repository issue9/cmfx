// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRBAC_RegisterResources(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(parent, suite.DB(), nil)
	a.NotError(err).NotNil(inst)

	m1 := "m1"
	err = inst.RegisterResources(m1, map[string]web.LocaleStringer{
		"r1": web.Phrase("r1"),
		"r2": web.Phrase("r2"),
	})
	a.NotError(err)

	err = inst.RegisterResources(m1, map[string]web.LocaleStringer{"r1": web.Phrase("r1")}) // 同名
	a.ErrorString(err, "资源 m1_r1 已经存在")

	m2 := "m2"
	err = inst.RegisterResources(m2, map[string]web.LocaleStringer{
		"r1": web.Phrase("r1"),
		"r2": web.Phrase("r2"),
	})
	a.NotError(err)
}

func TestRole_resources(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(parent, suite.DB(), suite.Server().Logs().ERROR())
	a.NotError(err).NotNil(inst)

	m1 := "m1"
	err = inst.RegisterResources(m1, map[string]web.LocaleStringer{
		"r1": web.Phrase("r1"),
		"r2": web.Phrase("r2"),
	})
	a.NotError(err)

	m2 := "m2"
	err = inst.RegisterResources(m2, map[string]web.LocaleStringer{
		"r1": web.Phrase("r1"),
		"r2": web.Phrase("r2"),
	})
	a.NotError(err)

	id, err := inst.NewRole(0, "r1", "r1 desc")
	a.NotError(err).NotZero(id)
	r1 := inst.Role(id)
	a.NotNil(r1)
	a.Equal(len(r1.resources()), len(inst.resources))

	id, err = inst.NewRole(r1.r.ID, "r2", "r2 desc")
	a.NotError(err).NotZero(id)
	r2 := inst.Role(id)
	a.NotNil(r2)
	a.Empty(r2.resources()) // 父角色未设定 allow，所以当前角色的 resources 也为空

	// 父角色添加资源
	a.NotError(r1.set("m1_r1"))
	a.Equal(r2.resources(), []string{"m1_r1"})

	// 父角色对资源进行了删减操作
	a.NotError(r1.set("m1_r2", "m2_r1"))
	a.Equal(r2.resources(), []string{"m1_r2", "m2_r1"})
}
