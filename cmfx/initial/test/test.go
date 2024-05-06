// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package test 初始化测试环境
package test

import (
	"net/http"
	"os"

	"github.com/issue9/assert/v4"
	"github.com/issue9/logs/v7"
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/server"
)

// NewServer 创建 [web.Server] 实例
func NewServer(a *assert.Assertion) web.Server {
	srv, err := server.NewHTTP("test", "1.0.0", &server.Options{
		Logs:       logs.New(logs.NewTermHandler(os.Stdout, nil), logs.WithLevels(logs.AllLevels()...), logs.WithCreated(logs.NanoLayout)),
		Codec:      web.NewCodec().AddMimetype(json.Mimetype, json.Marshal, json.Unmarshal, json.ProblemMimetype),
		HTTPServer: &http.Server{Addr: ":8080"},
	})
	a.NotError(err).NotNil(srv)

	return srv
}
