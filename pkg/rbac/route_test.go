// SPDX-License-Identifier: MIT

package rbac

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v3"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/pkg/test"
)

func TestRBAC_GetResourcesHandle(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer servertest.Run(a, suite.Server)()
	defer suite.Close()

	parent := "rbac"
	Install(suite.Server, parent, suite.DB())
	inst, err := New(suite.Server, parent, suite.DB())
	a.NotError(err).NotNil(inst)

	g1 := inst.NewGroup("g1", web.Phrase("g1"))
	g1.NewResource("r1", web.Phrase("r1"))
	g1.NewResource("r2", web.Phrase("r2"))

	g2 := inst.NewGroup("g2", web.Phrase("g2"))
	g2.NewResource("r1", web.Phrase("r1"))
	g2.NewResource("r2", web.Phrase("r2"))

	suite.NewRouter("def", nil).Get("/resources", inst.GetResourcesHandle)

	suite.Get("/resources").Header("Accept", "application/json").
		Do(nil).
		Status(http.StatusOK).
		StringBody(`{"groups":[{"title":"g1","resources":[{"id":"g1_r1","title":"r1"},{"id":"g1_r2","title":"r2"}]},{"title":"g2","resources":[{"id":"g2_r1","title":"r1"},{"id":"g2_r2","title":"r2"}]}]}`)
}
