// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package uploadtest 提供上传的测试用例
package uploadtest

import (
	"io/fs"
	"os"

	xupload "github.com/issue9/upload/v4"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/upload"
)

func NewModule(suite *test.Suite, id string) *upload.Module {
	baseURL := "/" + id
	return upload.Load(suite.NewModule(id), baseURL, NewSaver(suite, baseURL))
}

func NewSaver(suite *test.Suite, baseURL string) xupload.Saver {
	root, err := os.OpenRoot("./upload")
	if err != nil {
		panic(err)
	}

	s, err := xupload.NewLocalSaver(root, baseURL, xupload.Day, func(dir fs.FS, filename, ext string) string {
		return suite.Module().Server().ID() + ext // filename 可能带非英文字符
	})

	suite.Assertion().NotError(err).NotNil(s)
	return s
}
