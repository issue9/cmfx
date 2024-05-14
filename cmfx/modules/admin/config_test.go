// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/config"
)

var _ config.Sanitizer = &Config{}

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	conf := &Config{}
	err := conf.SanitizeConfig()
	a.Equal(err.Field, "superUser")
}
