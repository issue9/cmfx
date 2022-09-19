// SPDX-License-Identifier: MIT

package setting

import (
	"reflect"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/conv"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

func TestGroup(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := "test"
	db := suite.DB()
	Install(m, db)

	s := New(m, db)
	a.NotNil(s)
	obj := &testGroup{ID: 5}
	g, err := s.NewGroup("g1", obj, web.Phrase("title"), web.Phrase("desc"), testGroupAttrs, nil)
	a.NotError(err).NotNil(g)

	data := &modelSetting{Key: "id", Group: "g1"}
	found, err := s.dbPrefix.DB(db).Select(data)
	a.NotError(err).True(found)
	var fetchInt int64
	a.NotError(conv.Value(data.Value, reflect.ValueOf(&fetchInt)))
	a.Equal(fetchInt, 5)

	// Update
	obj.ID = 6
	obj.Name = "6"
	a.NotError(g.Update())
	data = &modelSetting{Key: "id", Group: "g1"}
	found, err = s.dbPrefix.DB(db).Select(data)
	a.NotError(err).True(found)
	a.NotError(conv.Value(data.Value, reflect.ValueOf(&fetchInt)))
	a.Equal(fetchInt, 6)

	data = &modelSetting{Key: "Name", Group: "g1"}
	found, err = s.dbPrefix.DB(db).Select(data)
	a.NotError(err).True(found)
	var fetchName string
	a.NotError(conv.Value(data.Value, reflect.ValueOf(&fetchName)))
	a.Equal(fetchName, "6")

	// Load
	data = &modelSetting{Key: "id", Group: "g1", Value: "8"}
	_, err = s.dbPrefix.DB(db).Update(data) // 直接修改了数据库
	a.NotError(err)
	a.NotError(g.Load())
	a.Equal(obj.ID, 8)
}
