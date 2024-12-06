// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package admin

import (
	"path/filepath"
	"testing"
	"time"

	"github.com/issue9/assert/v4"
	xupload "github.com/issue9/upload/v3"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/upload"
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
		Upload: &upload.Config{
			Size:  1024 * 1024 * 1024,
			Exts:  []string{".jpg"},
			Field: "files",
		},
	}
	suite.Assertion().NotError(o.SanitizeConfig())

	uploadSaver, err := xupload.NewLocalSaver("./upload", "/upload", xupload.Day, func(dir, filename, ext string) string {
		return filepath.Join(dir, suite.Module().Server().ID()+ext) // filename 可能带非英文字符
	})
	a.NotError(err).NotNil(uploadSaver)
	l := Install(mod, o, upload.Load(suite.NewModule("upload"), "/uploads", uploadSaver))
	a.NotNil(l)

	suite.TableExists(mod.ID() + "_info")
}
