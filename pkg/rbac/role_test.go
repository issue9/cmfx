// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRBAC_NewRole(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)
	inst, err := New(mod)
	a.NotError(err).NotNil(inst)
	e := inst.mod.DBEngine(nil)

	id, err := inst.NewRole(0, "0", "0-desc")
	a.NotError(err).NotZero(id)
	r := &role{}
	_, err = e.Where("id=?", id).Select(true, r)
	a.NotError(err).
		Equal(r.Name, "0").
		Equal(r.Description, "0-desc").
		Equal(r.Parent, 0)

	id2, err := inst.NewRole(id, "1", "1-desc")
	a.NotError(err).NotZero(id2)
	r = &role{}
	_, err = e.Where("id=?", id2).Select(true, r)
	a.NotError(err).
		Equal(r.Name, "1").
		Equal(r.Description, "1-desc").
		Equal(r.Parent, id)

	// parent 不存在
	rr3, err := inst.NewRole(10001, "10001", "10001-desc")
	a.Error(err).Zero(rr3)
}

func TestRole_update(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)
	inst, err := New(mod)
	a.NotError(err).NotNil(inst)
	e := inst.mod.DBEngine(nil)

	id, err := inst.NewRole(0, "0", "0-desc")
	a.NotError(err).True(id > 0)
	r := &role{}
	_, err = e.Where("id=?", id).Select(true, r)
	a.NotError(err).
		Equal(r.Name, "0").
		Equal(r.Description, "0-desc").
		Equal(r.Parent, 0)

	a.NotError(inst.Role(id).update("name", "desc"))
	_, err = e.Where("id=?", id).Select(true, r)
	a.NotError(err).
		Equal(r.Name, "name").
		Equal(r.Description, "desc").
		Equal(r.Parent, 0)
}

func TestRBAC_deleteRole(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)
	inst, err := New(mod)
	a.NotError(err).NotNil(inst)
	e := inst.mod.DBEngine(nil)

	// 删除不存在的角色
	a.NotError(inst.deleteRole(1))

	id, err := inst.NewRole(0, "0", "0-desc")
	a.NotError(err).NotZero(id)
	a.NotError(inst.deleteRole(id))
	cnt, err := e.Where("1=1").Count(&role{})
	a.NotError(err).Zero(cnt)

	// 删除有子类的角色
	id, err = inst.NewRole(0, "0", "0-desc")
	a.NotError(err)
	id2, err := inst.NewRole(id, "1", "1-desc")
	a.NotError(err).NotZero(id2)
	a.ErrorString(inst.deleteRole(id), "父类")
	cnt, err = e.Where("1=1").Count(&role{})
	a.NotError(err).Equal(cnt, 2)

	// id2 与 users[1] 关联，不能删除角色
	inst.users[1] = []int64{id2, id}
	a.Error(inst.deleteRole(id2))
	cnt, err = e.Where("1=1").Count(&role{})
	a.NotError(err).Equal(cnt, 2)
	a.Equal(inst.users[1], []int64{id2, id})
}

func TestRole_set(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)
	inst, err := New(mod)
	a.NotError(err).NotNil(inst)
	e := inst.mod.DBEngine(nil)

	id, err := inst.NewRole(0, "0", "0-desc")
	a.NotError(err).NotZero(id)
	rr := inst.Role(id)

	// 未指定资源
	a.NotError(rr.set())
	a.Empty(rr.r.Resources)

	// 正常指定资源
	a.NotError(rr.set("res-1", "res-2"))
	a.Equal(rr.r.Resources, []string{"res-1", "res-2"})
	r := &role{}
	_, err = e.Where("id=?", id).Select(true, r)
	a.NotError(err).Equal(r.Resources, []string{"res-1", "res-2"})

	// 子角色的相关操作

	id2, err := inst.NewRole(id, "1", "1-desc")
	a.NotError(err).NotZero(id2)
	id3, err := inst.NewRole(id2, "2", "2-desc")
	a.NotError(err).NotNil(id3)

	rr2 := inst.Role(id2)
	rr3 := inst.Role(id3)

	// 非父角色的资源
	a.ErrorString(rr2.set("res-1", "res-2", "res-100"), "只能继承父角色")

	a.NotError(rr2.set("res-2"))
	a.Equal(rr2.r.Resources, []string{"res-2"})
	a.NotError(rr3.set("res-2"))
	a.Equal(rr3.r.Resources, []string{"res-2"})
}

func TestRole_HasChild(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)
	inst, err := New(mod)
	a.NotError(err).NotNil(inst)

	r1, err := inst.NewRole(0, "r1", "r1-desc")
	a.NotError(err).NotZero(r1)

	r2, err := inst.NewRole(0, "r2", "r2-desc")
	a.NotError(err).NotZero(r2)

	r11, err := inst.NewRole(r1, "r11", "r11-desc")
	a.NotError(err).NotNil(r11)

	r111, err := inst.NewRole(r11, "r111", "r111-desc")
	a.NotError(err).NotNil(r111)

	a.False(inst.Role(r1).hasChild(0))
	a.False(inst.Role(r1).hasChild(r2))
	a.True(inst.Role(r1).hasChild(r1))
	a.True(inst.Role(r1).hasChild(r11))
	a.True(inst.Role(r1).hasChild(r111))
	a.True(inst.Role(r11).hasChild(r111))
	a.True(inst.Role(r111).hasChild(r111))
}

func TestRole_resources(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	mod := suite.NewModule("rbac")
	Install(mod)
	inst, err := New(mod)
	a.NotError(err).NotNil(inst)

	g1 := inst.NewGroup("g1", web.Phrase("g1"))
	g1r1 := g1.NewResource("r1", web.Phrase("r1"))
	g1r2 := g1.NewResource("r2", web.Phrase("r2"))

	g2 := inst.NewGroup("g2", web.Phrase("g2"))
	g2r1 := g2.NewResource("r1", web.Phrase("r1"))
	g2.NewResource("r2", web.Phrase("r2"))

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
	a.NotError(r1.set(g1r1))
	a.Equal(r2.resources(), []string{g1r1})

	// 父角色对资源进行了删减操作
	a.NotError(r1.set(g1r2, g2r1))
	a.Equal(r2.resources(), []string{g1r2, g2r1})
}
