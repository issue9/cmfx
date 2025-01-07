// 当前文件由 web 生成，请勿手动编辑！

package user

import (
	"database/sql/driver"
	"fmt"

	"github.com/issue9/web/filter"
	"github.com/issue9/web/locales"
	"github.com/issue9/web/openapi"
)

//--------------------- State ------------------------

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

// Scan sql.Scanner
func (s *State) Scan(src any) error {
	if src == nil {
		return locales.ErrInvalidValue()
	}

	var val string
	switch v := src.(type) {
	case string:
		val = v
	case []byte:
		val = string(v)
	case []rune:
		val = string(v)
	default:
		return locales.ErrInvalidValue()
	}

	v, err := ParseState(val)
	if err != nil {
		return err
	}

	*s = v
	return nil
}

// Value driver.Valuer
func (s State) Value() (driver.Value, error) {
	v, err := s.MarshalText()
	if err != nil {
		return nil, err
	}
	return string(v), nil
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
	s.Enum = []any{StateDeleted.String(), StateLocked.String(), StateNormal.String()}
}

//--------------------- end State --------------------
