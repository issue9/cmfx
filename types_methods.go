// 当前文件由 cmd/enums 生成，请勿手动编辑！

package cmfx

import (
	"fmt"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/locales"
)

// Sex

var sex2StringMap = map[Sex]string{
	SexUnknown: "unknown",
	SexMale:    "male",
	SexFemale:  "female",
}

var string2SexMap = map[string]Sex{
	"unknown": SexUnknown,
	"male":    SexMale,
	"female":  SexFemale,
}

// String fmt.Stringer
func (s Sex) String() string {
	if v, found := sex2StringMap[s]; found {
		return v
	}
	return fmt.Sprintf("Sex(%d)", s)
}

// MarshalText encoding.TextMarshaler
func (s Sex) MarshalText() ([]byte, error) {
	if v, found := sex2StringMap[s]; found {
		return []byte(v), nil
	}
	return []byte(fmt.Sprintf("Sex(%d)", s)), fmt.Errorf("未找到 %d 对应的字符串值", s)
}

// ParseSex 将字符串 v 解析为 State 类型
func ParseSex(v string) (Sex, error) {
	if t, found := string2SexMap[v]; found {
		return t, nil
	}
	return 0, fmt.Errorf("未找到 %s 对应的值", v)
}

// UnmarshalText encoding.TextUnmarshaler
func (s *Sex) UnmarshalText(p []byte) error {
	tmp, err := ParseSex(string(p))
	if err == nil {
		*s = tmp
	}
	return err
}

// IsValid 验证该状态值是否有效
func (s Sex) IsValid() bool {
	_, found := sex2StringMap[s]
	return found
}

func SexValidator(v Sex) bool {
	return v.IsValid()
}

var SexRule = filter.NewRule(SexValidator, locales.InvalidValue)

var SexSliceRule = filter.NewSliceRules[Sex, []Sex](SexRule)

var SexFilter = filter.New(SexRule)

var SexSliceFilter = filter.New(SexSliceRule)
