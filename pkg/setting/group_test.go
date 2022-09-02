// SPDX-License-Identifier: MIT

package setting

import (
	"encoding/json"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestGroup(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := suite.NewModule("test")
	db := suite.DB()
	a.NotError(Install(m, db))

	s := New(m, db)
	a.NotNil(s)
	obj := &testGroup{ID: 5}
	g, err := s.NewGroup("g1", obj, web.Phrase("title"), web.Phrase("desc"), testGroupAttrs, nil)
	a.NotError(err).NotNil(g)

	data := &setting{Key: "id", Group: "g1"}
	found, err := s.dbPrefix.DB(db).Select(data)
	a.NotError(err).True(found)
	fetch := &testGroup{}
	a.NotError(json.Unmarshal([]byte(data.Value), &fetch.ID))
	a.Equal(fetch.ID, 5)

	// Update
	obj.ID = 6
	obj.Name = "6"
	a.NotError(g.Update())
	data = &setting{Key: "id", Group: "g1"}
	found, err = s.dbPrefix.DB(db).Select(data)
	a.NotError(err).True(found)
	fetch = &testGroup{}
	a.NotError(json.Unmarshal([]byte(data.Value), &fetch.ID))
	a.Equal(fetch.ID, 6)

	data = &setting{Key: "Name", Group: "g1"}
	found, err = s.dbPrefix.DB(db).Select(data)
	a.NotError(err).True(found)
	fetch = &testGroup{}
	a.NotError(json.Unmarshal([]byte(data.Value), &fetch.Name))
	a.Equal(fetch.Name, "6")

	// Load
	data = &setting{Key: "id", Group: "g1", Value: "8"}
	_, err = s.dbPrefix.DB(db).Update(data) // 直接修改了数据库
	a.NotError(err)
	a.NotError(g.Load())
	a.Equal(obj.ID, 8)
}
