// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package query

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web"
)

var _ web.QueryUnmarshaler = &DateRange{}

func TestDateRange(t *testing.T) {
	a := assert.New(t, false)

	dr := DateRange{}
	a.NotError(dr.UnmarshalQuery(""))
	a.Zero(dr.Start).Zero(dr.End)

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("-0700"))
	a.Zero(dr.Start).Zero(dr.End)

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("0700,2001-01-02,2002-01-03"))
	a.True(dr.Start.After(time.Time{})).
		True(dr.End.After(dr.Start))

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("+0700,2001-01-02,2002-01-03,"))

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("-0730,2001-01-02"))
	a.True(dr.Start.After(time.Time{})).
		Zero(dr.End)

	dr = DateRange{}
	a.Error(dr.UnmarshalQuery("0700,2001-01-02,xxy"))
}
