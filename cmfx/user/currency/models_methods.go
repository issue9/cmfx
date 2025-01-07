// 当前文件由 web 生成，请勿手动编辑！

package currency

import (
	"database/sql/driver"
	"fmt"

	"github.com/issue9/web/filter"
	"github.com/issue9/web/locales"
	"github.com/issue9/web/openapi"
)

//--------------------- Type ------------------------

var _TypeToString = map[Type]string{
	TypeFreeze:   "freeze",
	TypeNormal:   "normal",
	TypeUnfreeze: "unfreeze",
}

var _TypeFromString = map[string]Type{
	"freeze":   TypeFreeze,
	"normal":   TypeNormal,
	"unfreeze": TypeUnfreeze,
}

// String fmt.Stringer
func (t Type) String() string {
	if v, found := _TypeToString[t]; found {
		return v
	}
	return fmt.Sprintf("Type(%d)", t)
}

func ParseType(v string) (Type, error) {
	if t, found := _TypeFromString[v]; found {
		return t, nil
	}
	return 0, locales.ErrInvalidValue()
}

// MarshalText encoding.TextMarshaler
func (t Type) MarshalText() ([]byte, error) {
	if v, found := _TypeToString[t]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

// UnmarshalText encoding.TextUnmarshaler
func (t *Type) UnmarshalText(p []byte) error {
	tmp, err := ParseType(string(p))
	if err == nil {
		*t = tmp
	}
	return err
}

func (t Type) IsValid() bool {
	_, found := _TypeToString[t]
	return found
}

// Scan sql.Scanner
func (t *Type) Scan(src any) error {
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

	v, err := ParseType(val)
	if err != nil {
		return err
	}

	*t = v
	return nil
}

// Value driver.Valuer
func (t Type) Value() (driver.Value, error) {
	v, err := t.MarshalText()
	if err != nil {
		return nil, err
	}
	return string(v), nil
}

func TypeValidator(v Type) bool { return v.IsValid() }

var (
	TypeRule = filter.V(TypeValidator, locales.InvalidValue)

	TypeSliceRule = filter.SV[[]Type](TypeValidator, locales.InvalidValue)

	TypeFilter = filter.NewBuilder(TypeRule)

	TypeSliceFilter = filter.NewBuilder(TypeSliceRule)
)

func (Type) OpenAPISchema(s *openapi.Schema) {
	s.Type = openapi.TypeString
	s.Enum = []any{TypeFreeze.String(), TypeNormal.String(), TypeUnfreeze.String()}
}

//--------------------- end Type --------------------
