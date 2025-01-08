// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestModule_Handle(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)

	mod := s.NewModule("article")
	m := Install(mod, "a", "t1", "t2")

	s.Router().Post("/articles", func(ctx *web.Context) web.Responser { return m.HandlePostArticle(ctx, 1) }).
		Get("/articles/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetArticle(ctx, id)
		})

	defer servertest.Run(a, s.Module().Server())()
	defer s.Close()

	t.Run("HandlePostArticles", func(t *testing.T) {
		article := &ArticleTO{
			Author:   "author",
			Title:    "title",
			Images:   []string{"https://example.com/img1.png", "https://example.com/img2.png"},
			Keywords: "k1,k2",
			Summary:  "summary",
			Content:  "content<p>line</p>",
			Topics:   []int64{1},
			Tags:     []int64{1, 2},
			Slug:     "slug",
			Views:    10,
			Order:    1,
		}
		data, err := json.Marshal(article)
		a.NotError(err)
		s.Post("/articles", data).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusCreated).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				println(string(body))
			})

		s.Get("/articles/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				vo := &ArticleVO{}
				err := json.Unmarshal(body, vo)
				a.NotError(err).
					Equal(vo.Author, article.Author).
					Equal(vo.Title, article.Title).
					Equal(vo.Images, article.Images).
					Equal(vo.Content, article.Content).
					Equal(vo.Order, article.Order)
			})
	})
}
