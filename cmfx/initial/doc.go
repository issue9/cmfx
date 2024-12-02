// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

package initial

import (
	"github.com/issue9/web"
	"github.com/issue9/web/mimetype/cbor"
	"github.com/issue9/web/mimetype/json"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares/auth/token"
	"github.com/issue9/webuse/v7/plugins/openapi/swagger"
)

func NewDocument(s web.Server) *openapi.Document {
	return openapi.New(s, web.Phrase("The api doc of %s", s.Name()),
		openapi.WithMediaType(json.Mimetype, cbor.Mimetype),
		openapi.WithClassicResponse(),
		openapi.WithContact("caixw", "", "https://github.com/caixw"),
		openapi.WithDescription(
			web.Phrase("summary"),
			web.Phrase("problems response:\n\n%s\n", openapi.MarkdownProblems(s, 0)),
		),
		openapi.WithSecurityScheme(token.SecurityScheme("token", web.Phrase("token auth"))),
		swagger.WithCDN(""),
	)
}
