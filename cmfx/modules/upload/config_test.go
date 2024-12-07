// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package upload

import (
	"testing"

	"github.com/issue9/assert/v4"
)

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	c := &Config{}
	a.Equal(c.SanitizeConfig().Field, "field")

	c = &Config{Size: -1}
	a.Equal(c.SanitizeConfig().Field, "size")

	c = &Config{Field: "123"}
	a.NotError(c.SanitizeConfig())
}
