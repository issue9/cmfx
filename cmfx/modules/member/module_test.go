// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
	"github.com/issue9/cmfx/cmfx/modules/upload/uploadtest"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user"
)

var _ web.Filter = &invitedQuery{}

func newModule(suite *test.Suite) *Module {
	mod := suite.NewModule("mem")
	return Load(mod, defaultConfig(suite.Assertion()), uploadtest.NewModule(suite, "mem_upload"), admintest.NewModule(suite))
}

func TestModule_NewMember(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	defer s.Close()
	mod := Install(s.NewModule("mem"), defaultConfig(a), uploadtest.NewModule(s, "mem_upload"), admintest.NewModule(s), nil, nil)

	u1, err := mod.NewMember(user.StateNormal, &RegisterInfo{
		Username: "u1",
		Password: "u1",
	}, "[:1]", "test", "test add")
	a.NotError(err).NotNil(u1)

	u2, err := mod.NewMember(user.StateNormal, &RegisterInfo{
		Username: "u2",
		Password: "u2",
		Inviter:  u1.ID,
	}, "[:1]", "test", "test add")
	a.NotError(err).NotNil(u2)

	u3, err := mod.NewMember(user.StateLocked, &RegisterInfo{
		Username: "u3",
		Password: "u3",
		Inviter:  u1.ID,
	}, "[:1]", "test", "test add")
	a.NotError(err).NotNil(u3)

	// invited,all

	invited, err := mod.Invited(u1.ID, &invitedQuery{Text: query.Text{Limit: query.Limit{Size: 20}}})
	a.NotError(err).
		NotNil(invited).
		Length(invited.Current, 2)
	list := make([]int64, 0)
	for _, m := range invited.Current {
		list = append(list, m.ID)
	}
	a.Equal(invited.Count, 2).
		False(invited.More).
		Equal(list, []int64{u2.ID, u3.ID})

	// invited, normal

	invited, err = mod.Invited(u1.ID, &invitedQuery{Text: query.Text{Limit: query.Limit{Size: 20}}, State: []user.State{user.StateNormal}})
	list = make([]int64, 0)
	for _, m := range invited.Current {
		list = append(list, m.ID)
	}
	a.NotError(err).
		Equal(invited.Count, 1).
		False(invited.More).
		Equal(list, []int64{u2.ID})
}
