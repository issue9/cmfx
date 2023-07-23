// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/middleware/v6/health"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
)

type System struct {
	s        *web.Server
	mod      string
	db       *orm.DB
	dbPrefix orm.Prefix

	admin  *admin.Admin
	health *health.Health
}

func New(mod string, desc web.LocaleStringer, s *web.Server, db *orm.DB, r *web.Router, adminM *admin.Admin) (*System, error) {
	store, err := newHealthDBStore(s, mod, db)
	if err != nil {
		return nil, err
	}

	m := &System{
		s:        s,
		mod:      mod,
		db:       db,
		dbPrefix: orm.Prefix(mod),

		admin:  adminM,
		health: health.New(store),
	}

	r.Use(m.health)

	g := adminM.ResourceGroup()
	resGetInfo := g.NewResource("get-info", web.Phrase("view system info"))
	resGetServices := g.NewResource("get-services", web.Phrase("view services"))
	resGetAPIs := g.NewResource("get-apis", web.Phrase("view apis"))

	m.admin.Router(r, web.MiddlewareFunc(m.admin.AuthFilter)).
		Get("/system/info", m.admin.RBACFilter(resGetInfo, m.adminGetInfo)).
		Get("/system/services", m.admin.RBACFilter(resGetServices, m.adminGetServices)).
		Get("/system/apis", m.admin.RBACFilter(resGetAPIs, m.adminGetAPIs))

	r.Get("/system/problems", m.commonGetProblems)

	return m, nil
}
