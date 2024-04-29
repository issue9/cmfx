// 当前文件由 web 生成，请勿手动编辑！

package types

import (
	"database/sql/driver"
	"fmt"

	"github.com/issue9/web/filter"
	"github.com/issue9/web/locales"
)

//---------------------Sex------------------------

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
func (S Sex) String() string {
	if v, found := _SexToString[S]; found {
		return v
	}
	return fmt.Sprintf("Sex(%d)", S)
}

func ParseSex(v string) (Sex, error) {
	if t, found := _SexFromString[v]; found {
		return t, nil
	}
	return 0, locales.ErrInvalidValue()
}

// MarshalText encoding.TextMarshaler
func (S Sex) MarshalText() ([]byte, error) {
	if v, found := _SexToString[S]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

// UnmarshalText encoding.TextUnmarshaler
func (S *Sex) UnmarshalText(p []byte) error {
	tmp, err := ParseSex(string(p))
	if err == nil {
		*S = tmp
	}
	return err
}

func (S Sex) IsValid() bool {
	_, found := _SexToString[S]
	return found
}

// Scan sql.Scanner
func (S *Sex) Scan(src any) error {
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

	*S = v
	return nil
}

// Value driver.Valuer
func (S Sex) Value() (driver.Value, error) {
	v, err := S.MarshalText()
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

//---------------------end Sex--------------------
