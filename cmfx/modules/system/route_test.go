// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/cmfx/cmfx/initial/test"
	"github.com/issue9/mux/v8/header"
	"github.com/issue9/web/server/servertest"
	"golang.org/x/text/language"
)

func TestSystem_apis(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	err := suite.Module().Server().Locale().SetString(language.SimplifiedChinese, "v1 desc", "v1 cn")
	a.NotError(err)
	newSystem(suite)

	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	suite.Get("/admin/system/info").
		Header(header.AcceptLanguage, language.SimplifiedChinese.String()).
		Header(header.Accept, "application/json;charset=utf-8").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/services").
		Header(header.AcceptLanguage, language.SimplifiedChinese.String()).
		Header(header.Accept, "application/json;charset=utf-8").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/apis").
		Header(header.AcceptLanguage, language.SimplifiedChinese.String()).
		Header(header.Accept, "application/json;charset=utf-8").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})
}
