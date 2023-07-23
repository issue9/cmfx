// SPDX-License-Identifier: MIT

// Package test 提供测试功能函数
package test

import (
	"net/http"
	"os"
	"strings"

	"github.com/issue9/assert/v3"
	"github.com/issue9/assert/v3/rest"
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/logs"
	"github.com/issue9/web/serializer/json"
	"github.com/issue9/web/serializer/xml"
	"github.com/issue9/web/server"
	"github.com/issue9/web/server/servertest"
	"gopkg.in/yaml.v3"

	"github.com/issue9/cmfx"

	_ "github.com/mattn/go-sqlite3"
)

type Suite struct {
	*web.Server
	a   *assert.Assertion
	db  *orm.DB
	dsn string

	closed bool
}

func NewSuite(a *assert.Assertion) *Suite {
	dsn := "test.db"
	db, err := orm.NewDB(dsn, dialect.Sqlite3("sqlite3"))
	a.NotError(err).NotNil(db)

	srv, err := web.NewServer("test", "1.0.0", &server.Options{
		Logs: &logs.Options{
			Levels:  logs.AllLevels(),
			Handler: logs.NewTermHandler(logs.NanoLayout, os.Stdout, nil),
		},
		Mimetypes: []*server.Mimetype{
			{Type: json.Mimetype, Marshal: json.Marshal, Unmarshal: json.Unmarshal, ProblemType: json.ProblemMimetype},
			{Type: xml.Mimetype, Marshal: xml.Marshal, Unmarshal: xml.Unmarshal, ProblemType: xml.ProblemMimetype},
		},
		HTTPServer: &http.Server{Addr: ":8080"},
	})
	a.NotError(err).NotNil(srv)
	srv.Config().Serializer().Add(yaml.Marshal, yaml.Unmarshal, ".yaml", ".yml")

	s := &Suite{
		Server: srv,
		a:      a,
		db:     db,
		dsn:    dsn,
	}

	cmfx.AddProblems(s.Server)

	s.a.TB().Cleanup(func() {
		s.Close()
	})

	return s
}

func (s *Suite) DB() *orm.DB { return s.db }

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
	s.Server.Close(0)

	s.a.NotError(s.db.Close())
	s.a.NotError(os.RemoveAll(s.dsn))
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

func (s *Suite) Get(url string) *rest.Request {
	return servertest.Get(s.a, buildURL(url))
}

func buildURL(url string) string {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		url = "http://localhost:8080" + url
	}
	return url
}
