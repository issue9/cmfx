// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"encoding/json"
	"fmt"
	"iter"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/user/usertest"
)

var (
	_ web.Filter            = &NoticeDetailTO{}
	_ openapi.OpenAPISchema = noticeKind("all")
)

type filter1 struct{}

func (f filter1) Desc() web.LocaleStringer { return web.Phrase("f1") }

func (f filter1) Users() iter.Seq[int64] {
	return func(yield func(int64) bool) {
		for i := range 1 {
			if !yield(int64(i)) {
				break
			}
		}
	}
}

func TestModule_Handle(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)
	user := usertest.NewModule(s)
	mod := Install(user)
	a.NotError(mod.Types().Add("t1"))

	router := s.Router().
		Post("/admin/notices", func(ctx *web.Context) web.Responser { return mod.HandlePostNotices(ctx, 1) }).
		Get("/admin/filters", mod.HandleGetFilters).
		Get("/admin/notices", mod.HandleGetNotices).
		Get("/admin/notices/{id}", func(ctx *web.Context) web.Responser { return mod.HandleGetNotice(ctx, "id") })
	router.Prefix("/user", mod.user).
		Get("/notices", mod.HandleGetUserNotices).
		Get("/notices/{no}", func(ctx *web.Context) web.Responser { return mod.HandleGetUserNotice(ctx, "no") }).
		Post("/notices/{no}/read", func(ctx *web.Context) web.Responser { return mod.HandlePostUserNoticeRead(ctx, "no") }).
		Delete("/notices/{no}/read", func(ctx *web.Context) web.Responser { return mod.HandleDeleteUserNoticeRead(ctx, "no") })

	defer servertest.Run(a, s.Module().Server())()
	defer s.Close()

	token := usertest.GetToken(s, mod.user)

	t.Run("HandleGetFilter", func(t *testing.T) {
		mod.RegisterFilter("f1", filter1{})
		s.Get("/admin/filters").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			StringBody(`{"f1":"f1"}`)
	})

	var no string
	t.Run("HandlePostNotices", func(t *testing.T) {
		n := &NoticeDetailTO{
			m:       mod,
			Kind:    "users",
			Users:   []int64{1},
			Type:    1,
			Author:  "author",
			Title:   "title",
			Content: "content",
		}
		data, err := json.Marshal(n)
		a.NotError(err)
		s.Post("/admin/notices", data).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusCreated).
			BodyFunc(func(a *assert.Assertion, body []byte) { fmt.Println(string(body)) })

		npo := &noticePO{}
		ssize, err := mod.user.Module().DB().Where("true").Select(true, npo)
		a.NotError(err).Equal(ssize, 1).
			False(npo.All).
			Equal(npo.Creator, 1).
			Equal(npo.Author, "author").
			Equal(npo.Title, "title").
			Equal(npo.Content, "content")
		no = npo.NO
	})

	t.Run("HandleGet*", func(t *testing.T) {
		s.Get("/admin/notices").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				obj := &query.Page[NoticeDetailVO]{}
				a.NotError(json.Unmarshal(body, obj)).
					Equal(obj.Count, 1).
					Equal(obj.Current[0].Content, "content").
					Equal(obj.Current[0].Author, "author").
					Equal(obj.Current[0].Creator, 1)
			})

		s.Get("/admin/notices/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {

				obj := &NoticeDetailVO{}
				a.NotError(json.Unmarshal(body, obj)).
					Equal(obj.Content, "content").
					Equal(obj.Author, "author").
					Equal(obj.Creator, 1)
			})

		s.Get("/user/notices").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Header(header.Authorization, auth.BearerToken(token)).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				obj := &query.Page[NoticeVO]{}
				a.NotError(json.Unmarshal(body, obj)).
					Equal(obj.Count, 1).
					Equal(obj.Current[0].Content, "content").
					Equal(obj.Current[0].Author, "author").
					False(obj.Current[0].Read.Valid)
			})

		s.Get("/user/notices/"+no).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Header(header.Authorization, auth.BearerToken(token)).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				obj := &NoticeVO{}
				a.NotError(json.Unmarshal(body, obj)).
					Equal(obj.Content, "content").
					Equal(obj.Author, "author").
					False(obj.Read.Valid)
			})
	})

	t.Run("read", func(t *testing.T) {
		s.Post("/user/notices/"+no+"/read", nil).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Header(header.Authorization, auth.BearerToken(token)).
			Do(nil).
			Status(http.StatusCreated)

		s.Get("/user/notices/"+no).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Header(header.Authorization, auth.BearerToken(token)).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				obj := &NoticeVO{}
				a.NotError(json.Unmarshal(body, obj)).True(obj.Read.Valid)
			})

		s.Delete("/user/notices/"+no+"/read").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Header(header.Authorization, auth.BearerToken(token)).
			Do(nil).
			Status(http.StatusNoContent)

		s.Get("/user/notices/"+no).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Header(header.Authorization, auth.BearerToken(token)).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				obj := &NoticeVO{}
				a.NotError(json.Unmarshal(body, obj)).False(obj.Read.Valid)
			})
	})

}
