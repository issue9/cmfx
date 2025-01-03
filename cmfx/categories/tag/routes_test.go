// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package tag

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

var _ web.Filter = &TagTO{}

func TestModule_routes(t *testing.T) {
	a := assert.New(t, false)
	s := test.NewSuite(a)

	mod := s.NewModule("tags")
	m := Install(mod, "tags", "t1", "t2")

	s.Module().Router().Get("/tags", m.HandleGetTags).
		Post("/tags", m.HandlePostTags).
		Put("/tags/{id}", func(ctx *web.Context) web.Responser { return m.HandlePutTag(ctx, "id") })

	defer servertest.Run(a, mod.Server())()
	defer s.Close()

	s.Get("/tags").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`[{"id":1,"title":"t1"},{"id":2,"title":"t2"}]`)

	s.Post("/tags", []byte(`{"title":"t3"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Do(nil).
		Status(http.StatusCreated)

	s.Get("/tags").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`[{"id":1,"title":"t1"},{"id":2,"title":"t2"},{"id":3,"title":"t3"}]`)

	s.Put("/tags/3", []byte(`{"title":"t4"}`)).
		Header(header.Accept, header.JSON).
		Header(header.ContentType, header.JSON).
		Do(nil).
		Status(http.StatusNoContent)

	s.Get("/tags").
		Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`[{"id":1,"title":"t1"},{"id":2,"title":"t2"},{"id":3,"title":"t4"}]`)
}
