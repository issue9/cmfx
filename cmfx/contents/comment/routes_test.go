// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

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

	mod := s.NewModule("comments")
	m := Install(mod, "a")

	s.Router().
		Post("/comments", func(ctx *web.Context) web.Responser { return m.HandlePostComment(ctx, 1, 1) }).
		Get("/comments", m.HandleGetComments).
		Get("/targets/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetCommentsByTarget(ctx, id)
		}).
		Get("/comments/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleGetComment(ctx, id)
		}).
		Patch("/comments/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandlePatchComment(ctx, id, 1)
		}).
		Delete("/comments/{id}", func(ctx *web.Context) web.Responser {
			id, resp := ctx.PathID("id", cmfx.NotFoundInvalidPath)
			if resp != nil {
				return resp
			}
			return m.HandleDeleteComment(ctx, id, 1)
		}).
		Get("/comments/{id}/snapshots", func(ctx *web.Context) web.Responser {
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
		article := &CommentTO{
			Author:  "author",
			Content: "content<p>line</p>",
			Rate:    5,
		}
		data, err := json.Marshal(article)
		a.NotError(err)
		s.Post("/comments", data).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusCreated)
		spo := &snapshotPO{}
		ssize, err := m.db.Where("true").Select(true, spo)
		a.NotError(err).Equal(ssize, 1)
		apo := &commentPO{}
		asize, err := m.db.Where("true").Select(true, apo)
		a.NotError(err).Equal(asize, ssize).
			Equal(apo.Last, spo.ID)

		s.Get("/comments?size=10&page=0").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				a.True(bytes.Index(body, []byte(`"count":1`)) >= 0)
			})

		s.Get("/targets/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusOK).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				a.True(bytes.Index(body, []byte(`"count":1`)) >= 0)
			})

		s.Get("/comments/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				vo := &CommentVO{}
				err := json.Unmarshal(body, vo)
				a.NotError(err).
					Equal(vo.Author, article.Author).
					Equal(vo.Content, article.Content).
					Equal(vo.Rate, article.Rate).
					Equal(vo.ID, 1)
			})

		// 更新数据，快照加 1

		s.Patch("/comments/1", data).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNoContent)
		spos := make([]*snapshotPO, 0, 10)
		ssize, err = m.db.Where("true").Select(true, &spos)
		a.NotError(err).Equal(ssize, 2).Length(spos, 2)
		apo = &commentPO{}
		asize, err = m.db.Where("true").Select(true, apo)
		a.NotError(err).Equal(asize, 1).
			Equal(apo.Last, 2). // 快照+1
			Equal(spos[0].Comment, apo.ID).
			Equal(spos[1].Comment, apo.ID)

		s.Get("/comments/1/snapshots?size=10&page=0").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				p := &query.Page[CommentVO]{}
				a.NotError(json.Unmarshal(body, p))
				a.Length(p.Current, 2).Equal(p.Count, 2, string(body))
			})

		// 分页
		s.Get("/comments/1/snapshots?size=1&page=0").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			BodyFunc(func(a *assert.Assertion, body []byte) {
				p := &query.Page[SnapshotVO]{}
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
					Equal(snapshot.Comment, 1)
			})

		// 删除之后，内容不再可获取

		s.Delete("/comments/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNoContent)

		s.Get("/snapshots/"+strconv.FormatInt(spos[1].ID, 10)).
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNotFound)

		s.Get("/comments/1").
			Header(header.ContentType, header.JSON).Header(header.Accept, header.JSON).
			Do(nil).
			Status(http.StatusNotFound)
	})
}
