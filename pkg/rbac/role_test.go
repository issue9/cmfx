// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v3"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRBAC_NewRole(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
	a.NotError(err).NotNil(inst)
	e := inst.dbPrefix.DB(inst.db)

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

	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
	a.NotError(err).NotNil(inst)
	e := inst.dbPrefix.DB(inst.db)

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

	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
	a.NotError(err).NotNil(inst)
	e := inst.dbPrefix.DB(inst.db)

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

	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
	a.NotError(err).NotNil(inst)
	e := inst.dbPrefix.DB(inst.db)

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

	parent := "rbac"
	Install(parent, suite.DB())
	inst, err := New(suite.Server(), parent, suite.DB())
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
