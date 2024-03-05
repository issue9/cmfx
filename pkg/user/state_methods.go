// 当前文件由 web 生成，请勿手动编辑！

package user

import (
	"fmt"

	"github.com/issue9/web"
	"github.com/issue9/web/locales"
)

//---------------------State------------------------

var _StateToString = map[State]string{
	StateDeleted: "deleted",
	StateLocked:  "locked",
	StateNormal:  "normal",
}

var _StateFromString = map[string]State{
	"deleted": StateDeleted,
	"locked":  StateLocked,
	"normal":  StateNormal,
}

// String fmt.Stringer
func (S State) String() string {
	if v, found := _StateToString[S]; found {
		return v
	}
	return fmt.Sprintf("State(%d)", S)
}

func ParseState(v string) (State, error) {
	if t, found := _StateFromString[v]; found {
		return t, nil
	}
	return 0, locales.ErrInvalidValue()
}

// MarshalText encoding.TextMarshaler
func (S State) MarshalText() ([]byte, error) {
	if v, found := _StateToString[S]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

// UnmarshalText encoding.TextUnmarshaler
func (S *State) UnmarshalText(p []byte) error {
	tmp, err := ParseState(string(p))
	if err == nil {
		*S = tmp
	}
	return err
}

func (S State) IsValid() bool {
	_, found := _StateToString[S]
	return found
}

func StateValidator(v State) bool { return v.IsValid() }

var (
	StateRule = web.NewRule(StateValidator, locales.InvalidValue)

	StateSliceRule = web.NewSliceRules[State, []State](StateRule)

	StateFilter = web.NewFilter(StateRule)

	StateSliceFilter = web.NewFilter(StateSliceRule)
)

//---------------------end State--------------------
