// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package test 初始化测试环境
package test

import (
	xj "encoding/json"
	"encoding/xml"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/issue9/assert/v4"
	"github.com/issue9/assert/v4/rest"
	"github.com/issue9/config"
	"github.com/issue9/logs/v7"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/cbor"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/mimetype/yaml"
	"github.com/issue9/web/openapi"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	"github.com/issue9/webuse/v7/middlewares/auth/token"
	"github.com/issue9/webuse/v7/plugins/openapi/swagger"
	"golang.org/x/text/language"
	xy "gopkg.in/yaml.v3"

	"github.com/issue9/cmfx/cmfx"

	_ "github.com/mattn/go-sqlite3"
)

var dsn = "test.db"

type Suite struct {
	a   *assert.Assertion
	mod *cmfx.Module

	closed bool
}

// NewSuite 新建测试套件
func NewSuite(a *assert.Assertion) *Suite {
	s := &Suite{
		a:   a,
		mod: newServer(a),
	}

	s.a.TB().Cleanup(func() { s.Close() })

	return s
}

func (s *Suite) Module() *cmfx.Module { return s.mod }

func (s *Suite) Router() *web.Router { return s.Module().Router() }

func (s *Suite) DB() *orm.DB { return s.Module().DB() }

func (s *Suite) Assertion() *assert.Assertion { return s.a }

// Close 关闭服务
//
// 如果未手动调用，则在 testing.TB.Cleanup 中自动关闭。
// 部分功能需要手动调用此方法，比如要主动关闭服务才能退出的路由测试。
func (s *Suite) Close() {
	if s.closed {
		return
	}

	s.closed = true
	s.Module().Server().Close(0)

	s.a.NotError(s.Module().DB().Close())
	s.a.NotError(os.RemoveAll(dsn))
}

func (s *Suite) NewRequest(method, url string) *rest.Request {
	return servertest.NewRequest(s.Assertion(), method, url)
}

func (s *Suite) Delete(url string) *rest.Request {
	return servertest.Delete(s.Assertion(), buildURL(url))
}

func (s *Suite) Post(url string, body []byte) *rest.Request {
	return servertest.Post(s.Assertion(), buildURL(url), body)
}

func (s *Suite) Patch(url string, body []byte) *rest.Request {
	return servertest.Patch(s.Assertion(), buildURL(url), body)
}

func (s *Suite) Put(url string, body []byte) *rest.Request {
	return servertest.NewRequest(s.Assertion(), http.MethodPut, buildURL(url)).Body(body)
}

func (s *Suite) Get(url string) *rest.Request { return servertest.Get(s.a, buildURL(url)) }

func buildURL(url string) string {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		url = "http://localhost:8080" + url
	}
	return url
}

func (s *Suite) NewModule(id string) *cmfx.Module { return s.Module().New(id, web.Phrase(id)) }

func (s *Suite) TableExists(name string) *Suite {
	s.Assertion().TB().Helper()

	exists, err := s.DB().SQLBuilder().TableExists().Table(name).Exists()
	s.Assertion().NotError(err).True(exists)
	return s
}

// newServer 创建 [web.Server] 实例
func newServer(a *assert.Assertion) *cmfx.Module {
	s := config.Serializer{}
	s.Add(xy.Marshal, xy.Unmarshal, ".yaml", ".yml").
		Add(xj.Marshal, xj.Unmarshal, ".json").
		Add(xml.Marshal, xml.Unmarshal, ".xml")

	srv, err := server.NewHTTP("test", "1.0.0", &server.Options{
		Language: language.SimplifiedChinese,
		Logs:     logs.New(logs.NewTermHandler(os.Stdout, nil), logs.WithLevels(logs.AllLevels()...), logs.WithCreated(logs.NanoLayout)),
		Codec: web.NewCodec().
			AddMimetype(json.Mimetype, json.Marshal, json.Unmarshal, json.ProblemMimetype).
			AddMimetype(yaml.Mimetype, yaml.Marshal, yaml.Unmarshal, yaml.ProblemMimetype).
			AddMimetype(cbor.Mimetype, cbor.Marshal, cbor.Unmarshal, cbor.ProblemMimetype),
		HTTPServer: &http.Server{Addr: ":8080"},
		Config:     config.Dir(s, "./"),
	})
	a.NotError(err).NotNil(srv)

	rate := ratelimit.New(web.NewCache("_test_rate", srv.Cache()), 10, time.Second, nil)

	db, err := orm.NewDB("", dsn, dialect.Sqlite3("sqlite3"))
	a.NotError(err).NotNil(db)

	doc := openapi.New(srv, web.Phrase("The api doc of %s", srv.ID()),
		openapi.WithMediaType(json.Mimetype, cbor.Mimetype),
		openapi.WithProblemResponse(),
		openapi.WithContact("caixw", "", "https://github.com/caixw"),
		openapi.WithDescription(
			nil,
			web.Phrase(`problems response:

%s
`, openapi.MarkdownProblems(srv, 0)),
		),
		openapi.WithSecurityScheme(token.SecurityScheme("token", web.Phrase("token auth"))),
		swagger.WithCDN(""),
	)

	return cmfx.Init(srv, rate, db, srv.Routers().New("amin", nil), doc)
}
