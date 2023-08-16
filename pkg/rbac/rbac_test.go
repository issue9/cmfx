// SPDX-License-Identifier: MIT

package rbac

import (
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRBAC_Link_IsAllow(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)

	inst, err := New(mod)
	a.NotError(err).NotNil(inst)

	id, err := inst.NewRole(0, "name", "desc")
	a.NotError(err).NotZero(id)
	id2, err := inst.NewRole(id, "name1", "desc1")
	a.NotError(err).NotZero(id2)

	a.NotError(inst.Role(id).set("res-1"))

	// Link 未指定角色
	tx, err := suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.NotError(inst.Link(tx, 1))
	a.NotError(tx.Commit())
	a.Empty(inst.users[1])

	// Link 不存在的角色
	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.Equal(inst.Link(tx, 1, id, id2, 10001).Error(), web.NewLocaleError("role %d not found", 10001).Error())
	a.NotError(tx.Commit())
	a.Empty(inst.users[1])

	// Link
	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.NotError(inst.Link(tx, 1, id, id2))
	a.Equal(inst.users[1], []int64{id, id2})
	a.NotError(tx.Commit())

	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.NotError(inst.Link(tx, 1, id, id2))
	a.NotError(tx.Commit())
	a.Equal(inst.users[1], []int64{id, id2})

	// IsAllow
	allowed, err := inst.isAllow(1, "not-exists")
	a.NotError(err).False(allowed)
	allowed, err = inst.isAllow(1, "res-1")
	a.NotError(err).True(allowed)

	// Unlink 未指定角色
	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.NotError(inst.Unlink(tx, 1))
	a.NotError(tx.Commit())
	a.Equal(inst.users[1], []int64{id, id2})

	// Unlink 不存在的角色
	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.Equal(inst.Unlink(tx, 1, id, id2, 10001).Error(), web.NewLocaleError("role %d not found", 10001).Error())
	a.NotError(tx.Commit())
	a.Equal(inst.users[1], []int64{id, id2})

	// Unlink
	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.NotError(inst.Unlink(tx, 1, id, id2))
	a.NotError(tx.Commit())
	a.Empty(inst.users[1])

	tx, err = suite.DB().Begin()
	a.NotError(err).NotNil(tx)
	a.NotError(inst.Unlink(tx, 1, id, id2))
	a.NotError(tx.Commit())

	allowed, err = inst.isAllow(1, "res-1")
	a.NotError(err).False(allowed)
}
