// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web/openapi"
	"github.com/issue9/web/server/servertest"
	"github.com/issue9/webuse/v7/middlewares/auth"
	"golang.org/x/text/language"

	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/cmfx/cmfx/modules/admin/admintest"
)

var _ openapi.OpenAPISchema = state(5)

func TestSystem_apis(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	err := suite.Module().Server().Locale().SetString(language.SimplifiedChinese, "v1 desc", "v1 cn")
	a.NotError(err)
	l := newModule(suite)

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	token := admintest.GetToken(suite, l.admin)

	suite.Get("/admin/system/info").
		Header(header.AcceptLanguage, language.SimplifiedChinese.String()).
		Header(header.Accept, "application/json;charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, token)).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/services").
		Header(header.AcceptLanguage, language.SimplifiedChinese.String()).
		Header(header.Accept, "application/json;charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, token)).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/routes").
		Header(header.AcceptLanguage, language.SimplifiedChinese.String()).
		Header(header.Accept, "application/json;charset=utf-8").
		Header(header.Authorization, auth.BuildToken(auth.Bearer, token)).
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})
}
