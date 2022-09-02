// SPDX-License-Identifier: MIT

package enum

import (
	"testing"

	"github.com/issue9/assert/v3"
)

func TestMarshal(t *testing.T) {
	a := assert.New(t, false)

	str1 := StateS1.String()
	a.Equal(str1, "s1")
	bs1, err := StateS1.MarshalText()
	a.NotError(err).Equal(string(bs1), str1)

	var v State = 5
	str5 := v.String()
	a.Equal(str5, "State(5)")
	bs5, err := v.MarshalText()
	a.ErrorString(err, "未找到").Equal(string(bs5), str5)
}

func TestUnmarshal(t *testing.T) {
	a := assert.New(t, false)
	var v State

	s1, err := ParseState("s1")
	a.NotError(err).Equal(s1, StateS1)
	a.NotError(v.UnmarshalText([]byte("s1")))
	a.Equal(v, s1)

	var v5 State
	s5, err := ParseState("s5")
	a.Error(err).Equal(s5, 0)
	a.Error(v5.UnmarshalText([]byte("s5")), "未找到")
	a.Equal(v5, s5)
}
