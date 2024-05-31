// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package test 初始化测试环境
package test

import (
	"net/http"
	"os"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/logs/v7"
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/config"

	"github.com/issue9/cmfx/cmfx/initial"
)

// NewServer 创建 [web.Server] 实例
func NewServer(a *assert.Assertion) web.Server {
	srv, err := server.NewHTTP("test", "1.0.0", &server.Options{
		Logs:       logs.New(logs.NewTermHandler(os.Stdout, nil), logs.WithLevels(logs.AllLevels()...), logs.WithCreated(logs.NanoLayout)),
		Codec:      web.NewCodec().AddMimetype(json.Mimetype, json.Marshal, json.Unmarshal, json.ProblemMimetype),
		HTTPServer: &http.Server{Addr: ":8080"},
	})
	a.NotError(err).NotNil(srv)

	initial.Init(srv, &initial.Ratelimit{
		Prefix:   "ratelimite___",
		Rate:     config.Duration(time.Second),
		Capacity: 10,
	})

	return srv
}
