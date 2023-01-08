// SPDX-License-Identifier: MIT

// Package test 提供测试功能函数
package test

import (
	"os"

	"github.com/issue9/assert/v3"
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/dialect"
	"github.com/issue9/unique"
	"github.com/issue9/web/server/servertest"
	"gopkg.in/yaml.v3"

	"github.com/issue9/cmfx"

	_ "github.com/mattn/go-sqlite3"
)

type Suite struct {
	*servertest.Tester
	a   *assert.Assertion
	db  *orm.DB
	dsn string

	closed bool
}

func NewSuite(a *assert.Assertion) *Suite {
	dsn := unique.Number().String() + "_test.db"
	db, err := orm.NewDB(dsn, dialect.Sqlite3("sqlite3"))
	a.NotError(err).NotNil(db)

	server := servertest.NewTester(a, nil)
	server.Server().Files().Add(yaml.Marshal, yaml.Unmarshal, ".yaml", ".yml")

	s := &Suite{
		Tester: server,
		a:      a,
		db:     db,
		dsn:    dsn,
	}

	cmfx.AddProblems(server.Server().Problems())

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
	s.Tester.Close(0)

	s.a.NotError(s.db.Close())
	s.a.NotError(os.RemoveAll(s.dsn))
}
