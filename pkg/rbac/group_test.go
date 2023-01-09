// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRBAC_Group(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
	a.NotError(err).NotNil(inst)

	a.Nil(inst.Group("g1"))
	g1 := inst.NewGroup("g1", web.Phrase("g1"))
	a.NotNil(g1)
	g11 := inst.Group("g1")
	a.Equal(g1, g11)

	a.PanicString(func() {
		inst.NewGroup("g1", web.Phrase("g11"))
	}, "已经存在同名的分组 g1")
}

func TestRBAC_Group_AddResources(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
	a.NotError(err).NotNil(inst)

	g1 := inst.NewGroup("g1", web.Phrase("g1"))
	g1.AddResources(map[string]web.LocaleStringer{
		"r1": web.Phrase("r1"),
		"r2": web.Phrase("r2"),
	})

	a.PanicString(func() {
		g1.AddResources(map[string]web.LocaleStringer{
			"r1": web.Phrase("r1"),
		})
	}, "存在同名的资源 ID r1")

	// 不同组下可以有相同的 id
	g2 := inst.NewGroup("g2", web.Phrase("g2"))
	g2.AddResources(map[string]web.LocaleStringer{
		"r1": web.Phrase("r1"),
		"r2": web.Phrase("r2"),
	})
}
