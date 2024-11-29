// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package initial

import (
	"github.com/issue9/webuse/v7/plugins/openapi/swagger"

	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/cbor"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/openapi"
)

func NewDocument(s web.Server) *openapi.Document {
	return openapi.New(s, web.Phrase("The api doc of %s", s.Name()),
		openapi.WithMediaType(json.Mimetype, cbor.Mimetype),
		openapi.WithResponse(&openapi.Response{
			Ref:  &openapi.Ref{Ref: "empty"},
			Body: &openapi.Schema{Type: openapi.TypeObject},
		}),
		openapi.WithProblemResponse(),
		openapi.WithContact("caixw", "", "https://github.com/caixw"),
		swagger.WithCDN(""),
	)
}
