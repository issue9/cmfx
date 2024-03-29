// 当前文件由 web 生成，请勿手动编辑！

package cmfx

import (
	"fmt"

	"github.com/issue9/web"
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

func SexValidator(v Sex) bool { return v.IsValid() }

var (
	SexRule = web.NewRule(SexValidator, locales.InvalidValue)

	SexSliceRule = web.NewSliceRules[Sex, []Sex](SexRule)

	SexFilter = web.NewFilter(SexRule)

	SexSliceFilter = web.NewFilter(SexSliceRule)
)

//---------------------end Sex--------------------
