// 当前文件由 cmd/enums 生成，请勿手动编辑！

package enum

import (
	"fmt"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/locales"
)

var state2StringMap = map[State]string{
	StateS1: "s1",
	StateS2: "s2",
}

var string2StateMap = map[string]State{
	"s1": StateS1,
	"s2": StateS2,
}

// String fmt.Stringer
func (t State) String() string {
	if v, found := state2StringMap[t]; found {
		return v
	}
	return fmt.Sprintf("State(%d)", t)
}

// MarshalText encoding.TextMarshaler
func (t State) MarshalText() ([]byte, error) {
	if v, found := state2StringMap[t]; found {
		return []byte(v), nil
	}
	return []byte(fmt.Sprintf("State(%d)", t)), fmt.Errorf("未找到 %d 对应的字符串值", t)
}

// ParseState 将字符串 v 解析为 State 类型
func ParseState(v string) (State, error) {
	if t, found := string2StateMap[v]; found {
		return t, nil
	}
	return 0, fmt.Errorf("未找到 %s 对应的值", v)
}

// UnmarshalText encoding.TextUnmarshaler
func (t *State) UnmarshalText(p []byte) error {
	tmp, err := ParseState(string(p))
	if err == nil {
		*t = tmp
	}
	return err
}

// IsValid 验证该状态值是否有效
func (t State) IsValid() bool {
	_, found := state2StringMap[t]
	return found
}

func StateValidator(v any) bool {
	vv, ok := v.(string)
	if !ok {
		return false
	}
	vvv, err := ParseState(vv)
	if err != nil {
		return false
	}
	return vvv.IsValid()
}

var StateRule = web.NewRuleFunc(locales.InvalidValue, StateValidator)
