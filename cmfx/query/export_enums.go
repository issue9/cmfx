// 当前文件由 web 生成，请勿手动编辑！

package query

import (
	"database/sql/driver"
	"fmt"

	"github.com/issue9/web/filter"
	"github.com/issue9/web/locales"
)

//--------------------- ExportType ------------------------

var _ExportTypeToString = map[ExportType]string{
	ExportTypeCSV:   "csv",
	ExportTypeExcel: "excel",
	ExportTypeODS:   "ods",
}

var _ExportTypeFromString = map[string]ExportType{
	"csv":   ExportTypeCSV,
	"excel": ExportTypeExcel,
	"ods":   ExportTypeODS,
}

// String fmt.Stringer
func (e ExportType) String() string {
	if v, found := _ExportTypeToString[e]; found {
		return v
	}
	return fmt.Sprintf("ExportType(%d)", e)
}

func ParseExportType(v string) (ExportType, error) {
	if t, found := _ExportTypeFromString[v]; found {
		return t, nil
	}
	return 0, locales.ErrInvalidValue()
}

// MarshalText encoding.TextMarshaler
func (e ExportType) MarshalText() ([]byte, error) {
	if v, found := _ExportTypeToString[e]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

// UnmarshalText encoding.TextUnmarshaler
func (e *ExportType) UnmarshalText(p []byte) error {
	tmp, err := ParseExportType(string(p))
	if err == nil {
		*e = tmp
	}
	return err
}

func (e ExportType) IsValid() bool {
	_, found := _ExportTypeToString[e]
	return found
}

// Scan sql.Scanner
func (e *ExportType) Scan(src any) error {
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

	v, err := ParseExportType(val)
	if err != nil {
		return err
	}

	*e = v
	return nil
}

// Value driver.Valuer
func (e ExportType) Value() (driver.Value, error) {
	v, err := e.MarshalText()
	if err != nil {
		return nil, err
	}
	return string(v), nil
}

func ExportTypeValidator(v ExportType) bool { return v.IsValid() }

var (
	ExportTypeRule = filter.V(ExportTypeValidator, locales.InvalidValue)

	ExportTypeSliceRule = filter.SV[[]ExportType](ExportTypeValidator, locales.InvalidValue)

	ExportTypeFilter = filter.NewBuilder(ExportTypeRule)

	ExportTypeSliceFilter = filter.NewBuilder(ExportTypeSliceRule)
)

//--------------------- end ExportType --------------------
