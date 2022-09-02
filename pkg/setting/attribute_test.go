// SPDX-License-Identifier: MIT

package setting

import (
	"bytes"
	"reflect"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"
)

type testGroup struct {
	ID   int
	Name string
	Tags []string
}

var testGroupAttrs = map[string]*Attribute{
	"ID": {
		ID:    "id",
		Title: web.Phrase("id"),
		Desc:  web.Phrase("id desc"),
	},
	"Name": {
		Title: web.Phrase("name"),
		Desc:  web.Phrase("name desc"),
	},
	"Tags": {
		ID:       "tags",
		Title:    web.Phrase("tags"),
		Desc:     web.Phrase("tags desc"),
		Multiple: true,
		Candidate: []Candidate{
			{Value: "1", Title: web.Phrase("1"), Desc: web.Phrase("1 desc")},
			{Value: "2", Title: web.Phrase("2"), Desc: web.Phrase("2 desc")},
			{Value: "3", Title: web.Phrase("3"), Desc: web.Phrase("3 desc")},
			{Value: "4", Title: web.Phrase("4"), Desc: web.Phrase("4 desc")},
			{Value: "5", Title: web.Phrase("5"), Desc: web.Phrase("5 desc")},
		},
	},
}

/*
func TestSetting_Register(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()
	m := suite.NewModule("test")
	db := suite.DB()
	a.NotError(Install(m, db))
	s := New(m, db)
	a.NotNil(s)

	s.Register("test", &testGroup{}, web.Phrase("title"), web.Phrase("desc"), testGroupAttrs)
	a.Length(s.attributes, 1)

	a.PanicString(func() {
		s.Register("test", &testGroup{}, web.Phrase("title"), web.Phrase("desc"), testGroupAttrs)
	}, "已经存在相同 id 的对象: test")
	a.Length(s.attributes, 1)
}
*/

func TestParseAttribute(t *testing.T) {
	a := assert.New(t, false)

	type age uint
	type g1 struct {
		ID   int
		Name string
		Age  age
	}

	attrs := parseAttribute(reflect.TypeOf(g1{}), map[string]*Attribute{
		"ID": {
			Title: web.Phrase("id"),
			Desc:  web.Phrase("id desc"),
		},
		"Name": {
			Title: web.Phrase("name"),
			Desc:  web.Phrase("name desc"),
		},
		"Age": {
			Title: web.Phrase("age"),
			Desc:  web.Phrase("age desc"),
		},
	})
	a.Length(attrs, 3).
		Equal(attrs["ID"].id, "ID").NotNil(attrs["ID"].title).
		Equal(attrs["Name"].id, "Name").NotNil(attrs["Name"].title).
		Equal(attrs["Name"].index, 1).
		Equal(attrs["Age"].index, 2)

	type g2 struct {
		G1 g1 `setting:"g1"`
	}

	a.PanicString(func() {
		parseAttribute(reflect.TypeOf(g2{}), nil)
	}, "attrs 中的参数数量与 t 的字段数量不相符")

	a.PanicString(func() {
		parseAttribute(reflect.TypeOf(g2{}), map[string]*Attribute{"G1": {}})
	}, "字段 G1 并非基本类型")

	type g3 struct {
		int `setting:"g1"`
	}
	a.PanicString(func() {
		parseAttribute(reflect.TypeOf(g3{5}), map[string]*Attribute{"int": {}})
	}, "不支持匿名字段")

	type g4 struct {
		ID  int
		Age []int
	}
	attrs = parseAttribute(reflect.TypeOf(g4{}), map[string]*Attribute{
		"ID": {
			Title:     web.Phrase("id"),
			Desc:      web.Phrase("id desc"),
			Candidate: []Candidate{{Value: 1, Title: web.Phrase("1"), Desc: web.Phrase("1 desc")}, {Value: 2, Title: web.Phrase("2"), Desc: web.Phrase("2 desc")}},
		},
		"Age": {Multiple: true, Title: web.Phrase("age"), Desc: web.Phrase("age desc")},
	})
	a.Length(attrs["ID"].candidate, 2)

	a.PanicString(func() {
		attrs = parseAttribute(reflect.TypeOf(g4{}), map[string]*Attribute{
			"ID": {
				Title:     web.Phrase("id"),
				Desc:      web.Phrase("id desc"),
				Candidate: []Candidate{{Value: "1", Title: web.Phrase("1"), Desc: web.Phrase("1 desc")}, {Value: "2", Title: web.Phrase("2"), Desc: web.Phrase("2 desc")}},
			},
			"Age": {Multiple: true, Title: web.Phrase("age"), Desc: web.Phrase("age desc")},
		})
	}, "候选列表的元素类型 string 与值的类型 number 不同")

}

func TestGetType(t *testing.T) {
	a := assert.New(t, false)

	a.Equal(getType(reflect.TypeOf(5)), TypeNumber)
	a.Equal(getType(reflect.TypeOf("")), TypeString)
	a.Equal(getType(reflect.TypeOf(.5)), TypeNumber)
	a.Equal(getType(reflect.TypeOf(true)), TypeBool)
	a.Equal(getType(reflect.TypeOf([]int8{1, 2})), TypeNumber)

	a.PanicString(func() {
		getType(reflect.TypeOf(&bytes.Buffer{}))
	}, "无效的 kind:")
}
