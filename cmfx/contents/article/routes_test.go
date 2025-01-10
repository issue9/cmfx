// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"bytes"
	"encoding/json"
	"net/http"
	"strconv"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/query"
)

func TestModule_Handle(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)

	mod := s.NewModule("article")
	m := Install(mod, "a", "t1", "t2")

	s.Router().
		Post("/articles", func(ctx *web.Context) web.Responser { return m.HandlePostArticle(ctx, 1) }).
		Get("/articles", m.HandleGetArticles).
		Get("/topics/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetArticlesByTopic(ctx, id)
		}).
		Get("/tags/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetArticlesByTag(ctx, id)
		}).
		Get("/articles/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetArticle(ctx, id)
		}).
		Patch("/articles/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandlePatchArticle(ctx, id, 1)
		}).
		Delete("/articles/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleDeleteArticle(ctx, id, 1)
		}).
		Get("/articles/{id}/snapshots", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetSnapshots(ctx, id)
		}).
		Get("/snapshots/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetSnapshot(ctx, id)
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
			Status(http.StatusCreated)
		spo := &snapshotPO{}
		ssize, err := m.db.Where("true").Select(true, spo)
		a.NotError(err).Equal(ssize, 1)
		apo := &articlePO{}
		asize, err := m.db.Where("true").Select(true, apo)
		a.NotError(err).Equal(asize, ssize).
			Equal(apo.Last, spo.ID)

		s.Get("/articles?size=10&page=0").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				a.True(bytes.Index(body, []byte(`"count":1`)) >= 0)
			})

		s.Get("/tags/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				a.True(bytes.Index(body, []byte(`"count":1`)) >= 0)
			})

		s.Get("/topics/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				a.True(bytes.Index(body, []byte(`"count":1`)) >= 0)
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
					Equal(vo.Order, article.Order).
					Equal(vo.ID, 1)
			})

		// 更新数据，快照加 1

		s.Patch("/articles/1", data).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNoContent)
		spos := make([]*snapshotPO, 0, 10)
		ssize, err = m.db.Where("true").Select(true, &spos)
		a.NotError(err).Equal(ssize, 2).Length(spos, 2)
		apo = &articlePO{}
		asize, err = m.db.Where("true").Select(true, apo)
		a.NotError(err).Equal(asize, 1).
			Equal(apo.Last, 2). // 快照+1
			Equal(spos[0].Article, apo.ID).
			Equal(spos[1].Article, apo.ID)

		s.Get("/articles/1/snapshots?size=10&page=0").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				p := &query.Page[OverviewVO]{}
				a.NotError(json.Unmarshal(body, p))
				a.Length(p.Current, 2).Equal(p.Count, 2, string(body))
			})

		// 分页
		s.Get("/articles/1/snapshots?size=1&page=0").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				p := &query.Page[SnapshotOverviewVO]{}
				a.NotError(json.Unmarshal(body, p))
				a.Length(p.Current, 1).Equal(p.Count, 2, string(body))
			})

		s.Get("/snapshots/"+strconv.FormatInt(spos[1].ID, 10)).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				snapshot := &SnapshotVO{}
				a.NotError(json.Unmarshal(body, snapshot))
				a.Equal(snapshot.ID, 2).
					Equal(snapshot.Article, 1)
			})

		// 删除之后，内容不再可获取

		s.Delete("/articles/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNoContent)

		s.Get("/snapshots/"+strconv.FormatInt(spos[1].ID, 10)).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNotFound)

		s.Get("/articles/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNotFound)
	})
}
