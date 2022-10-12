// SPDX-License-Identifier: MIT

package query

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/pkg/test"
)

var _ web.CTXSanitizer = &Limit{}

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

	s.GoServe()
	defer s.Close()

	// 无数据   404
	r.Get("/q0", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return Paging[testMod](ctx, q, sql)
	})
	s.Get("/q0").
		Header("accept", "application/json").
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
		return Paging[testMod](ctx, q, sql)
	})
	s.Get("/q1").
		Header("accept", "application/json").
		Do(nil).
		StringBody(`{"count":3,"current":[{"ID":1,"Name":"1"},{"ID":2,"Name":"2"},{"ID":3,"Name":"3"}]}`)

		// size=2
	r.Get("/q2", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return Paging[testMod](ctx, q, sql)
	})
	s.Get("/q2?size=2").
		Header("accept", "application/json").
		Do(nil).
		StringBody(`{"count":3,"current":[{"ID":1,"Name":"1"},{"ID":2,"Name":"2"}],"more":true}`)

		// size=2&page=1
	r.Get("/q3", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return Paging[testMod](ctx, q, sql)
	})
	s.Get("/q3?size=2&page=1").
		Header("accept", "application/json").
		Do(nil).
		StringBody(`{"count":3,"current":[{"ID":3,"Name":"3"}]}`)

		// size=2&page=2   404
	r.Get("/q4", func(ctx *web.Context) web.Responser {
		q := &Limit{}
		ctx.QueryObject(true, q, "400")
		sql := s.DB().SQLBuilder().Where().Select(s.DB()).From("mods")
		return Paging[testMod](ctx, q, sql)
	})
	s.Get("/q4?size=2&page=2").
		Header("accept", "application/json").
		Do(nil).
		Status(http.StatusNotFound)
}
