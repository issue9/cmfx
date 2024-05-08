// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package settings

import (
	"reflect"
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

type options struct {
	F1 string `setting:"f1"`
	F2 int
	F3 string `setting:"-"` // 不存储
	f4 string // 不存储
	F5 string `setting:""`
	f6 string `setting:"f6"` // 不存储
}

func TestObject(t *testing.T) {
	const tableName = "setting"

	a := assert.New(t, false)
	s := test.NewSuite(a)
	mod := s.NewModule("mod")
	Install(mod, tableName)

	ss := New(mod, tableName, 0)
	a.NotNil(ss).NotError(InstallObject(ss, "opt", &options{F2: 2}))

	// NewObject

	a.PanicString(func() {
		_, _ = NewObject[*options](ss, "opt")
	}, "T 的约束必须是结构体")

	a.PanicString(func() {
		_, _ = NewObject[options](ss, "not-exists")
	}, "设置对象 not-exists 未安装")

	obj, err := NewObject[options](ss, "opt")
	a.NotError(err).NotNil(obj).
		Length(obj.users, 0).
		NotNil(obj.preset)

	// Object.Get

	opt, err := obj.Get(1)
	a.NotError(err).NotNil(opt).
		Equal(opt.F2, 2).
		Length(obj.users, 1)

	// Object.Set

	opt.F2 = 1
	a.NotError(obj.Set(1, opt))
	opt, err = obj.Get(1)
	a.NotError(err).NotNil(opt).
		Equal(opt.F2, 1).
		Length(obj.users, 1) // 主动写入了数据
}

func TestGetFieldName(t *testing.T) {
	a := assert.New(t, false)

	rt := reflect.TypeOf(options{})
	a.Equal(getFieldName(rt.Field(0)), "f1").
		Equal(getFieldName(rt.Field(1)), "F2").
		Equal(getFieldName(rt.Field(2)), "").
		Equal(getFieldName(rt.Field(3)), "").
		Equal(getFieldName(rt.Field(4)), "F5").
		Equal(getFieldName(rt.Field(5)), "")
}
