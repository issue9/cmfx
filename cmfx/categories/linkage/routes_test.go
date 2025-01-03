// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package linkage

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

var _ web.Filter = &LinkageTO{}

func TestModule_routes(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)

	mod := s.NewModule("tags")
	m := Install(mod, "linkages", &Linkage{Title: "root", Items: []*Linkage{{Title: "s1"}}})

	s.Module().Router().Get("/lk", m.HandleGetLinkages).
		Post("/lk/{id}", func(ctx *web.Context) web.Responser { return m.HandlePostLinkage(ctx, "id") }).
		Put("/lk/{id}", func(ctx *web.Context) web.Responser { return m.HandlePutLinkage(ctx, "id") }).
		Delete("/lk/{id}", func(ctx *web.Context) web.Responser { return m.HandleDeleteLinkage(ctx, "id") })

	defer servertest.Run(a, mod.Server())()
	defer s.Close()

	s.Get("/lk").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`{"id":1,"title":"root","items":[{"id":2,"title":"s1"}]}`)

	s.Put("/lk/2", []byte(`{"title":"s2"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Do(nil).
		Status(http.StatusNoContent)
	s.Get("/lk").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`{"id":1,"title":"root","items":[{"id":2,"title":"s2"}]}`)

	s.Post("/lk/2", []byte(`{"title":"s3"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Do(nil).
		Status(http.StatusCreated)
	s.Get("/lk").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`{"id":1,"title":"root","items":[{"id":2,"title":"s2","items":[{"id":3,"title":"s3"}]}]}`)

	s.Delete("/lk/2").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusNoContent)
	s.Get("/lk").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`{"id":1,"title":"root"}`)
}
