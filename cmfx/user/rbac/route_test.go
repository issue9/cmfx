// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package rbac

import (
	"net/http"
	"testing"

	"github.com/issue9/assert/v4"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/web"
	"github.com/issue9/web/server/servertest"

	"github.com/issue9/cmfx/cmfx/initial/test"
)

func TestRBAC_GetResourcesHandle(t *testing.T) {
	a := assert.New(t, false)
	suite := test.NewSuite(a)
	defer servertest.Run(a, suite.Module().Server())()
	defer suite.Close()

	mod := suite.NewModule("rbac")
	Install(mod)
	rbac := New(mod, nil)
	a.NotNil(rbac)
	inst, err := rbac.NewRoleGroup("g1", 0)
	a.NotError(err).NotNil(inst)

	g1 := inst.RBAC().NewResourceGroup("g1", web.Phrase("g1"))
	g1.New("r1", web.Phrase("r1"))
	g1.New("r2", web.Phrase("r2"))

	g2 := inst.RBAC().NewResourceGroup("g2", web.Phrase("g2"))
	g2.New("r1", web.Phrase("r1"))
	g2.New("r2", web.Phrase("r2"))

	mod.Router().Get("/resources", func(ctx *web.Context) web.Responser { return GetResourcesHandle(inst, ctx) })

	suite.Get("/resources").Header(header.Accept, header.JSON).
		Do(nil).
		Status(http.StatusOK).
		StringBody(`[{"id":"g1","title":"g1","items":[{"id":"g1_r1","title":"r1"},{"id":"g1_r2","title":"r2"}]},{"id":"g2","title":"g2","items":[{"id":"g2_r1","title":"r1"},{"id":"g2_r2","title":"r2"}]}]`)
}
