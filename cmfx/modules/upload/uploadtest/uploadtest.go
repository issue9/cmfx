// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package uploadtest 提供上传的测试用例
package uploadtest

import (
	"path/filepath"

	xupload "github.com/issue9/upload/v3"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/upload"
)

func NewModule(suite *test.Suite, id string) *upload.Module {
	baseURL := "/" + id
	return upload.Load(suite.NewModule(id), baseURL, NewSaver(suite, baseURL))
}

func NewSaver(suite *test.Suite, baseURL string) xupload.Saver {
	s, err := xupload.NewLocalSaver("./upload", baseURL, xupload.Day, func(dir, filename, ext string) string {
		return filepath.Join(dir, suite.Module().Server().ID()+ext) // filename 可能带非英文字符
	})

	suite.Assertion().NotError(err).NotNil(s)
	return s
}
