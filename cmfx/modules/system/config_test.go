// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"testing"

	"github.com/issue9/assert/v4"
)

func TestConfig_SanitizeConfig(t *testing.T) {
	a := assert.New(t, false)

	conf := &Config{}
	a.NotError(conf.SanitizeConfig())

	conf = &Config{
		Backup: &Backup{},
	}
	err := conf.SanitizeConfig()
	a.Equal(err.Field, "backup.dir")

	conf = &Config{
		Backup: &Backup{Dir: "./install.go"},
	}
	err = conf.SanitizeConfig()
	a.Equal(err.Field, "backup.dir")

	conf = &Config{
		Backup: &Backup{Dir: "./", Cron: "0 0 23 * * *"},
	}
	err = conf.SanitizeConfig()
	a.NotError(err).NotNil(conf.Backup.buildFile)
}
