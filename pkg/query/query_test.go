// SPDX-License-Identifier: MIT

package query

import (
	"testing"
	"time"

	"github.com/issue9/assert/v3"
)

func TestDateRange(t *testing.T) {
	a := assert.New(t, false)

	dr := DateRange{}
	a.NotError(dr.UnmarshalQuery(""))
	a.Zero(dr.Start).Zero(dr.End)

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("1-2"))
	a.True(dr.Start.After(time.Time{})).
		True(dr.End.After(dr.Start))

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("1-2-"))

	dr = DateRange{}
	a.NotError(dr.UnmarshalQuery("1"))
	a.True(dr.Start.After(time.Time{})).
		Zero(dr.End)

	dr = DateRange{}
	a.Error(dr.UnmarshalQuery("1-xxy"))
}
