// 当前文件由 web 生成，请勿手动编辑！

package comment

import (
	"fmt"

	"github.com/issue9/web/filter"
	"github.com/issue9/web/locales"
	"github.com/issue9/web/openapi"
)

//--------------------- State ------------------------

var _StateToString = map[State]string{
	StateHidden:  "hidden",
	StateTop:     "top",
	StateVisible: "visible",
}

var _StateFromString = map[string]State{
	"hidden":  StateHidden,
	"top":     StateTop,
	"visible": StateVisible,
}

// String fmt.Stringer
func (s State) String() string {
	if v, found := _StateToString[s]; found {
		return v
	}
	return fmt.Sprintf("State(%d)", s)
}

func ParseState(v string) (State, error) {
	if t, found := _StateFromString[v]; found {
		return t, nil
	}
	return 0, locales.ErrInvalidValue()
}

// MarshalText encoding.TextMarshaler
func (s State) MarshalText() ([]byte, error) {
	if v, found := _StateToString[s]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

// UnmarshalText encoding.TextUnmarshaler
func (s *State) UnmarshalText(p []byte) error {
	tmp, err := ParseState(string(p))
	if err == nil {
		*s = tmp
	}
	return err
}

func (s State) IsValid() bool {
	_, found := _StateToString[s]
	return found
}

func StateValidator(v State) bool { return v.IsValid() }

var (
	StateRule = filter.V(StateValidator, locales.InvalidValue)

	StateSliceRule = filter.SV[[]State](StateValidator, locales.InvalidValue)

	StateFilter = filter.NewBuilder(StateRule)

	StateSliceFilter = filter.NewBuilder(StateSliceRule)
)

func (State) OpenAPISchema(s *openapi.Schema) {
	s.Type = openapi.TypeString
	s.Enum = []any{StateHidden.String(), StateTop.String(), StateVisible.String()}
}

//--------------------- end State --------------------
