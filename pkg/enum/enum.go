// SPDX-License-Identifier: MIT

// Package enum 提供对枚举方法的生成
//
// 枚举值需要 MarshalText 和 String 等方法，其代码格式基本相同。
// 当前包提供了自动生成这些方法的方便途径。
//
// 用户需要自定义枚举类型和枚举值，当前包只提供了对各类方法的生成。
// 用户可以采用当前包中的 make_state.go 的方式生成，也可以采用 cmd/enums 命令行生成。
package enum

// TODO(caixw): 改成类型于 stringer 方式的自动扫描包内容生成相应的方法！

import (
	"bytes"
	"strings"

	"github.com/issue9/errwrap"
	"github.com/issue9/source"
)

const header = "// 当前文件由 cmd/enums 生成，请勿手动编辑！\n"

// Enum 定义枚举类型
type Enum struct {
	Name     string   // 类型名
	Receiver string   // 方法的接收名
	Fields   []string // 枚举名称，每个名称前会去除类型名前缀

	vals           []string
	string2TypeMap string
	type2StringMap string
}

func (e *Enum) parse() error {
	if len(e.Fields) == 0 {
		panic("未指定任何枚举元素")
	}

	if len(e.Receiver) == 0 {
		panic("receiver 不能为空")
	}

	for _, val := range e.Fields {
		e.vals = append(e.vals, strings.TrimPrefix(val, e.Name))

	}

	e.string2TypeMap = "string2" + e.Name + "Map"
	e.type2StringMap = strings.ToLower(e.Name) + "2StringMap"

	return nil
}

// Write 输出枚举内容到指定的文件
func Write(file, pkg string, enum ...*Enum) error {
	if file == "" {
		panic("file 不能为空")
	}

	if pkg == "" {
		panic("pkg 不能为空")
	}

	if len(enum) == 0 {
		panic("参数 enum 不能为空")
	}

	buf := &errwrap.Buffer{Buffer: bytes.Buffer{}}

	buf.WString(header).WByte('\n').
		Printf("package %s \n\n", pkg).
		WString(`import (`).WByte('\n').
		WString(`"fmt"`).WByte('\n').
		WString(`"github.com/issue9/web/filter"`).WString("\n\n").
		WString(`"github.com/issue9/cmfx/locales"`).WByte('\n').
		WString(`)`).WByte('\n').WByte('\n')

	for _, e := range enum {
		if err := e.write(buf); err != nil {
			return err
		}
	}

	if buf.Err != nil {
		return buf.Err
	}

	return source.DumpGoSource(file, buf.Bytes())
}

func (e *Enum) write(buf *errwrap.Buffer) error {
	if err := e.parse(); err != nil {
		return err
	}

	buf.Printf("\n\n// %s\n\n", e.Name)

	// type2StringMap
	buf.Printf("var %s=map[%s]string{\n", e.type2StringMap, e.Name)
	for _, v := range e.vals {
		buf.Printf("%s:\"%s\",\n", e.Name+v, strings.ToLower(v))
	}
	buf.WString("}\n\n")

	// string2TypeMap
	buf.Printf("var %s=map[string]%s{\n", e.string2TypeMap, e.Name)
	for _, v := range e.vals {
		buf.Printf("\"%s\":%s,\n", strings.ToLower(v), e.Name+v)
	}
	buf.WString("}\n\n")

	// String
	buf.WString("// String fmt.Stringer\n").
		Printf("func (%s %s)String()string{\n", e.Receiver, e.Name).
		Printf("if v,found := %s[%s];found{\n", e.type2StringMap, e.Receiver).
		WString("return v\n").
		WString("}\n").
		Printf(`return fmt.Sprintf("%s(%%d)", %s)`, e.Name, e.Receiver).WRune('\n').
		WString("}\n\n")

	// TextMarshaler
	buf.WString("// MarshalText encoding.TextMarshaler\n").
		Printf("func(%s %s) MarshalText()([]byte,error){\n", e.Receiver, e.Name).
		Printf("if v,found := %s[%s];found{\n", e.type2StringMap, e.Receiver).
		WString("return []byte(v),nil\n").
		WString("}\n").
		Printf(`return []byte(fmt.Sprintf("%s(%%d)", %s)),fmt.Errorf("未找到 %%d 对应的字符串值", %s)`, e.Name, e.Receiver, e.Receiver).WRune('\n').
		WString("}\n\n")

	// ParseType
	buf.Printf("// Parse%s 将字符串 v 解析为 State 类型\n", e.Name).
		Printf("func Parse%s(v string)(%s,error){\n", e.Name, e.Name).
		Printf("if t,found := %s[v];found{\n", e.string2TypeMap).
		WString("return t,nil\n").
		WString("}\n").
		WString(`return 0,fmt.Errorf("未找到 %s 对应的值", v)`).WRune('\n').
		WString("}\n\n")

	// TextUnmarshaler
	buf.WString("// UnmarshalText encoding.TextUnmarshaler\n").
		Printf("func(%s *%s) UnmarshalText(p []byte)(error){\n", e.Receiver, e.Name).
		Printf("tmp,err :=Parse%s(string(p))\n", e.Name).
		WString("if err==nil{\n").
		Printf("*%s=tmp\n", e.Receiver).
		WString("}\n").
		WString("return err\n").
		WString("}\n\n")

	// IsValid
	buf.WString("// IsValid 验证该状态值是否有效\n").
		Printf("func(%s %s)IsValid()bool{\n", e.Receiver, e.Name).
		Printf("_,found :=%s[%s];\n", e.type2StringMap, e.Receiver).
		WString("return found\n").
		WString("}\n\n")

	// Validator
	buf.Printf("func %sValidator(v %s) bool {\n", e.Name, e.Name).
		WString("return v.IsValid()\n").
		WString("}\n\n")

	// rule
	buf.Printf(`var %sRule = filter.NewRule(%sValidator, locales.InvalidValue)`, e.Name, e.Name)
	buf.WString("\n\n")

	// sliceRule
	buf.Printf(`var %sSliceRule = filter.NewSliceRules[%s,[]%s](%sRule)`, e.Name, e.Name, e.Name, e.Name)
	buf.WString("\n\n")

	// filter
	buf.Printf(`var %sFilter = filter.New(%sRule)`, e.Name, e.Name)
	buf.WString("\n\n")

	// sliceFilter
	buf.Printf(`var %sSliceFilter = filter.New(%sSliceRule)`, e.Name, e.Name)

	return nil
}
