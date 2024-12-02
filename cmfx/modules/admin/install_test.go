// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/user"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer suite.Close()

	mod := suite.NewModule("test")
	o := &Config{
		SuperUser: 1,
		User: &user.Config{
			URLPrefix:      "/admin",
			AccessExpired:  config.Duration(time.Minute),
			RefreshExpired: config.Duration(time.Minute * 2),
		},
		Upload: &Upload{
			Size:  1024 * 1024 * 1024,
			Exts:  []string{".jpg"},
			Field: "files",
		},
	}
	suite.Assertion().NotError(o.SanitizeConfig())
	l := Install(mod, o)
	a.NotNil(l)

	suite.TableExists(mod.ID() + "_info")
}
