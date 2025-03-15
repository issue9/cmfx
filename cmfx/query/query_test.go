// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package query

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"
)

var (
	_ web.Filter           = &Limit{}
	_ web.QueryUnmarshaler = &DateRange{}
)

func TestDateRange_UnmarshalQuery(t *testing.T) {
	a := assert.New(t, false)

	r := &DateRange{}
	a.NotError(r.UnmarshalQuery("")).
		True(r.Start.IsZero()).
		True(r.End.IsZero())

	r = &DateRange{}
	a.NotError(r.UnmarshalQuery("~")).
		True(r.Start.IsZero()).
		True(r.End.IsZero())

	r = &DateRange{}
	a.NotError(r.UnmarshalQuery("2024-01-02T15:04:05+07:00")).
		False(r.Start.IsZero()).Equal(r.Start.Year(), 2024).
		True(r.End.IsZero())

	r = &DateRange{}
	a.NotError(r.UnmarshalQuery("2024-01-02T15:04:05+07:00~")).
		False(r.Start.IsZero()).Equal(r.Start.Year(), 2024).
		True(r.End.IsZero())

	r = &DateRange{}
	a.NotError(r.UnmarshalQuery("2024-01-02T15:04:05+07:00~2025-02-02T15:04:05+07:00")).
		False(r.Start.IsZero()).Equal(r.Start.Year(), 2024).
		False(r.End.IsZero()).Equal(r.End.Year(), 2025)

	r = &DateRange{}
	a.NotError(r.UnmarshalQuery("~2025-02-02T15:04:05+07:00")).
		True(r.Start.IsZero()).
		False(r.End.IsZero()).Equal(r.End.Year(), 2025)

	r = &DateRange{}
	a.Error(r.UnmarshalQuery("~2025-02-"))
}
