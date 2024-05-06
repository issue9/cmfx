// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package test

import (
	"os"
	"strings"

	"github.com/issue9/assert/v4"
	"github.com/issue9/assert/v4/rest"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/dialect"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial"

	_ "github.com/mattn/go-sqlite3"
)

type Suite struct {
	a   *assert.Assertion
	dsn string
	mod *cmfx.Module

	closed bool
}

// NewSuite 新建测试套件
func NewSuite(a *assert.Assertion) *Suite {
	dsn := "test.db"
	db, err := orm.NewDB("", dsn, dialect.Sqlite3("sqlite3"))
	a.NotError(err).NotNil(db)

	srv := NewServer(a)
	s := &Suite{
		a:   a,
		dsn: dsn,
		mod: cmfx.NewModule("", web.Phrase("suite"), srv, db, srv.Routers().New("default", nil)),
	}

	initial.Init(srv)

	s.a.TB().Cleanup(func() {
		s.Close()
	})

	return s
}

// Module [Suite] 本身也是 [cmfx.Module]
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

func (s *Suite) Get(url string) *rest.Request { return servertest.Get(s.a, buildURL(url)) }

func buildURL(url string) string {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		url = "http://localhost:8080" + url
	}
	return url
}

func (s *Suite) NewModule(id string) *cmfx.Module { return s.Module().New(id, web.Phrase(id)) }

func (s *Suite) TableExists(name string) *Suite{
	exists, err := s.DB().SQLBuilder().TableExists().Table(name).Exists()
	s.Assertion().NotError(err).True(exists)
	return s
}
