// SPDX-License-Identifier: MIT

package system

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web/server/servertest"
	"golang.org/x/text/language"

	"github.com/issue9/cmfx/pkg/test"
)

func TestSystem_apis(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	err := suite.CatalogBuilder().SetString(language.SimplifiedChinese, "v1 desc", "v1 cn")
	a.NotError(err)
	newSystem(suite)

	defer servertest.Run(a, suite.Server)()
	defer suite.Close()

	suite.Get("/admin/system/info").
		Header("accept-language", language.SimplifiedChinese.String()).
		Header("accept", "application/json;charset=utf-8").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/services").
		Header("accept-language", language.SimplifiedChinese.String()).
		Header("accept", "application/json;charset=utf-8").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/apis").
		Header("accept-language", language.SimplifiedChinese.String()).
		Header("accept", "application/json;charset=utf-8").
		Do(nil).
		Status(http.StatusOK).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})
}
