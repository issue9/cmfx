// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package settings

import (
	"testing"

	"github.com/issue9/assert/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestInstall(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	mod := s.NewModule("test")
	Install(mod, "settings")

	s.TableExists("test_settings")
}

func TestInstallObject(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	mod := s.NewModule("test")
	Install(mod, "settings")
	ss := New(mod, "settings")
	a.NotNil(ss)

	a.NotError(InstallObject(ss, "opt", &options{F1: "f1"}))

	// 检测字段是都写入

	f1 := &settingPO{Group: "opt", Key: "f1", UID: 0}
	found, err := ss.db.Select(f1)
	a.NotError(err).True(found)

	// 零值也正常写入
	f2 := &settingPO{Group: "opt", Key: "F2", UID: 0}
	found, err = ss.db.Select(f2)
	a.NotError(err).True(found)
}
