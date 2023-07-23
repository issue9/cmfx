// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestGroup(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	parent := "rbac"
	Install(suite.Server, parent, suite.DB())
	inst, err := New(suite.Server, parent, suite.DB())
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

func TestGroup_NewResources(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	parent := "rbac"
	Install(suite.Server, parent, suite.DB())
	inst, err := New(suite.Server, parent, suite.DB())
	a.NotError(err).NotNil(inst)

	g1 := inst.NewGroup("g1", web.Phrase("g1"))
	g1r1 := g1.NewResource("r1", web.Phrase("r1"))
	a.Equal(g1r1, buildResourceID(g1.ID(), "r1"))
	g1.NewResource("r2", web.Phrase("r2"))

	a.PanicString(func() {
		g1.NewResource("r1", web.Phrase("r1"))
	}, "存在同名的资源 ID r1")

	// 不同组下可以有相同的 id
	g2 := inst.NewGroup("g2", web.Phrase("g2"))
	g2.NewResource("r1", web.Phrase("r1"))
	g2.NewResource("r2", web.Phrase("r2"))

}
