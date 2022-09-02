// SPDX-License-Identifier: MIT

package system

import (
	"encoding/json"
	"testing"

	"github.com/issue9/assert/v3"
	"golang.org/x/text/language"

	"github.com/issue9/cmfx/pkg/test"
)

func testSystem_apis(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	err := suite.Server().CatalogBuilder().SetString(language.SimplifiedChinese, "v1 desc", "v1 cn")
	a.NotError(err)
	newSystem(suite)

	suite.GoServe()

	suite.Get("/admin/system/apis").
		Header("accept-language", language.SimplifiedChinese.String()).
		Header("accept", "application/json;charset=utf-8").
		Do(nil).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/info").
		Header("accept-language", language.SimplifiedChinese.String()).
		Header("accept", "application/json;charset=utf-8").
		Do(nil).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Get("/admin/system/services").
		Header("accept-language", language.SimplifiedChinese.String()).
		Header("accept", "application/json;charset=utf-8").
		Do(nil).
		BodyFunc(func(a *assert.Assertion, body []byte) {
			a.True(json.Valid(body)).
				NotEmpty(body)
		})

	suite.Close()
}
