// 当前文件由 web 生成，请勿手动编辑！

package types

import (
	"database/sql/driver"
	"fmt"

	"github.com/fxamacker/cbor/v2"
	"github.com/issue9/web/filter"
	"github.com/issue9/web/locales"
	"github.com/issue9/web/openapi"
)

//--------------------- Sex ------------------------

var _SexToString = map[Sex]string{
	SexFemale:  "female",
	SexMale:    "male",
	SexUnknown: "unknown",
}

var _SexFromString = map[string]Sex{
	"female":  SexFemale,
	"male":    SexMale,
	"unknown": SexUnknown,
}

// String fmt.Stringer
func (s Sex) String() string {
	if v, found := _SexToString[s]; found {
		return v
	}
	return fmt.Sprintf("Sex(%d)", s)
}

func ParseSex(v string) (Sex, error) {
	if t, found := _SexFromString[v]; found {
		return t, nil
	}
	return 0, locales.ErrInvalidValue()
}

func (s Sex) MarshalText() ([]byte, error) {
	if v, found := _SexToString[s]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

func (s *Sex) UnmarshalText(p []byte) error {
	tmp, err := ParseSex(string(p))
	if err == nil {
		*s = tmp
	}
	return err
}

func (s Sex) MarshalCBOR() ([]byte, error) {
	if v, found := _SexToString[s]; found {
		return cbor.Marshal(v)
	}
	return nil, locales.ErrInvalidValue()
}

func (s *Sex) UnmarshalCBOR(p []byte) error {
	var tmp string
	if err := cbor.Unmarshal(p, &tmp); err != nil {
		return err
	}

	if ss, found := _SexFromString[tmp]; found {
		*s = ss
		return nil
	}
	return locales.ErrInvalidValue()
}

func (s Sex) IsValid() bool {
	_, found := _SexToString[s]
	return found
}

// Scan sql.Scanner
func (s *Sex) Scan(src any) error {
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

	v, err := ParseSex(val)
	if err != nil {
		return err
	}

	*s = v
	return nil
}

// Value driver.Valuer
func (s Sex) Value() (driver.Value, error) {
	v, err := s.MarshalText()
	if err != nil {
		return nil, err
	}
	return string(v), nil
}

func SexValidator(v Sex) bool { return v.IsValid() }

var (
	SexRule = filter.V(SexValidator, locales.InvalidValue)

	SexSliceRule = filter.SV[[]Sex](SexValidator, locales.InvalidValue)

	SexFilter = filter.NewBuilder(SexRule)

	SexSliceFilter = filter.NewBuilder(SexSliceRule)
)

func (Sex) OpenAPISchema(s *openapi.Schema) {
	s.Type = openapi.TypeString
	s.Enum = []any{SexFemale.String(), SexMale.String(), SexUnknown.String()}
}

//--------------------- end Sex --------------------
