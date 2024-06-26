// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package query

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

type testMod struct {
	ID   int64  `orm:"name(id);ai"`
	Name string `orm:"name(name);len(20)"`
}

func (m *testMod) TableName() string { return "mods" }

func TestPaging(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	r := s.Router()

	a.NotError(s.DB().Create(&testMod{}))

	defer servertest.Run(a, s.Module().Server())()
	defer s.Close()

	// 无数据   404
	r.Get("/q0", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return PagingResponser[testMod](ctx, q, sql, nil)
	})
	s.Get("/q0").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusNotFound)

	a.NotError(s.DB().InsertMany(10, []orm.TableNamer{
		&testMod{Name: "1"},
		&testMod{Name: "2"},
		&testMod{Name: "3"},
	}...))

	r.Get("/q1", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return PagingResponser[testMod](ctx, q, sql, nil)
	})
	s.Get("/q1").
		Header(header.Accept, header.JSON).
		Do(nil).
		StringBody(`{"count":3,"current":[{"ID":1,"Name":"1"},{"ID":2,"Name":"2"},{"ID":3,"Name":"3"}]}`)

		// size=2
	r.Get("/q2", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return PagingResponser[testMod](ctx, q, sql, nil)
	})
	s.Get("/q2?size=2").
		Header(header.Accept, header.JSON).
		Do(nil).
		StringBody(`{"count":3,"current":[{"ID":1,"Name":"1"},{"ID":2,"Name":"2"}],"more":true}`)

		// size=2&page=1
	r.Get("/q3", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return PagingResponser[testMod](ctx, q, sql, nil)
	})
	s.Get("/q3?size=2&page=1").
		Header(header.Accept, header.JSON).
		Do(nil).
		StringBody(`{"count":3,"current":[{"ID":3,"Name":"3"}]}`)

		// size=2&page=2   404
	r.Get("/q4", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return PagingResponser[testMod](ctx, q, sql, nil)
	})
	servertest.Get(a, "http://localhost:8080/q4?size=2&page=2").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusNotFound)
}
