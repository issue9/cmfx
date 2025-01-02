// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/query"
)

type adminArticlesQuery struct {
	query.Text
	Topic   []int64 `json:"topic"`
	Creator []int64 `json:"creator"`
}

func (q *adminArticlesQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
	// TODO
}

func (m *Module) adminGetArticles(ctx *web.Context) web.Responser {
	q := &adminArticlesQuery{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	// TODO

	return ctx.NotImplemented()
}

func (m *Module) adminGetArticle(ctx *web.Context) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

func (m *Module) getTopics(ctx *web.Context) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

func (m *Module) memberGetArticle(ctx *web.Context) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

type memberArticlesQuery struct {
	// TODO
}

func (q *memberArticlesQuery) Filter(ctx *web.Context) {
	// TODO
}

func (m *Module) memberGetArticles(ctx *web.Context) web.Responser {
	// TODO
	return ctx.NotImplemented()
}
