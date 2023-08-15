// 当前文件由 cmd/enums 生成，请勿手动编辑！

package user

import (
	"fmt"
	"github.com/issue9/web/filter"

	"github.com/issue9/cmfx/locales"
)

// State

var state2StringMap = map[State]string{
	StateNormal:  "normal",
	StateLocked:  "locked",
	StateDeleted: "deleted",
}

var string2StateMap = map[string]State{
	"normal":  StateNormal,
	"locked":  StateLocked,
	"deleted": StateDeleted,
}

// String fmt.Stringer
func (s State) String() string {
	if v, found := state2StringMap[s]; found {
		return v
	}
	return fmt.Sprintf("State(%d)", s)
}

// MarshalText encoding.TextMarshaler
func (s State) MarshalText() ([]byte, error) {
	if v, found := state2StringMap[s]; found {
		return []byte(v), nil
	}
	return []byte(fmt.Sprintf("State(%d)", s)), fmt.Errorf("未找到 %d 对应的字符串值", s)
}

// ParseState 将字符串 v 解析为 State 类型
func ParseState(v string) (State, error) {
	if t, found := string2StateMap[v]; found {
		return t, nil
	}
	return 0, fmt.Errorf("未找到 %s 对应的值", v)
}

// UnmarshalText encoding.TextUnmarshaler
func (s *State) UnmarshalText(p []byte) error {
	tmp, err := ParseState(string(p))
	if err == nil {
		*s = tmp
	}
	return err
}

// IsValid 验证该状态值是否有效
func (s State) IsValid() bool {
	_, found := state2StringMap[s]
	return found
}

func StateValidator(v State) bool {
	return v.IsValid()
}

var StateRule = filter.NewRule(StateValidator, locales.InvalidValue)

var StateSliceRule = filter.NewSliceRules[State, []State](StateRule)

var StateFilter = filter.New(StateRule)

var StateSliceFilter = filter.New(StateSliceRule)
