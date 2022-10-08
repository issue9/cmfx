// SPDX-License-Identifier: MIT

package setting

import (
	"fmt"
	"reflect"
	"unicode"

	"github.com/issue9/web"
)

// Attribute 对配置对象各个字段的描述
type Attribute struct {
	ID          string
	Title, Desc web.LocaleStringer
	Multiple    bool // 多行文本
	Candidate   []Candidate
}

// Candidate 候选数据
type Candidate struct {
	Value       any
	Title, Desc web.LocaleStringer // 值的字面文本以及详细说明，desc 可以为空。
}

type groupAttribute struct {
	id     string
	title  web.LocaleStringer
	desc   web.LocaleStringer
	fields map[string]*fieldAttribute
	t      reflect.Type
}

type fieldAttribute struct {
	id    string
	title web.LocaleStringer
	desc  web.LocaleStringer

	typ       string // 类型名称，如果输出的是 xml，类型是必须的。
	candidate []Candidate
	multiple  bool // 多行文本
	slice     bool // 是否为数组，如果输出的是 xml，此属性是必须的。

	index int // 在对象中的索引
}

func parseAttribute(t reflect.Type, attrs map[string]*Attribute) map[string]*fieldAttribute {
	nums := t.NumField()

	items := make(map[string]*fieldAttribute, nums)
	for i := 0; i < nums; i++ {
		ft := t.Field(i)
		if !unicode.IsUpper(rune(ft.Name[0])) {
			continue
		}

		if !isAllowItemKind(ft.Type.Kind()) {
			panic(fmt.Sprintf("字段 %s 并非基本类型", ft.Name))
		}

		if ft.Anonymous {
			panic("不支持匿名字段")
		}

		attr, found := attrs[ft.Name]
		if !found {
			panic(fmt.Sprintf("未指定 %s 字段的属性", ft.Name))
		}

		t := getType(ft.Type)
		if len(attr.Candidate) > 0 {
			if ct := getType(reflect.TypeOf(attr.Candidate[0].Value)); ct != t {
				panic(fmt.Sprintf("候选列表的元素类型 %s 与值的类型 %s 不同", ct, t))
			}
		}

		id := ft.Name
		if attr.ID != "" {
			id = attr.ID
		}
		items[id] = &fieldAttribute{
			id:        id,
			title:     attr.Title,
			desc:      attr.Desc,
			multiple:  attr.Multiple,
			typ:       t,
			candidate: attr.Candidate,
			slice:     ft.Type.Kind() == reflect.Slice,
			index:     i,
		}
	}

	return items
}

func isAllowItemKind(k reflect.Kind) bool {
	return k >= reflect.Bool && k <= reflect.Float64 ||
		k == reflect.Slice || k == reflect.String
}

func getType(t reflect.Type) string {
	switch t.Kind() {
	case reflect.Bool:
		return TypeBool
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64,
		reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64,
		reflect.Float64, reflect.Float32:
		return TypeNumber
	case reflect.String:
		return TypeString
	case reflect.Slice:
		return getType(t.Elem())
	default:
		panic("无效的 kind:" + t.Kind().String())
	}
}
