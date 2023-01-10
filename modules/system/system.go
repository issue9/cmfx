// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/middleware/v6/health"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
)

const (
	resGetInfo     = "get-info"
	resGetAPIs     = "get-apis"
	resGetServices = "get-services"
	resGetSettings = "get-settings"
	resGetLinkages = "get-linkages"
)

type System struct {
	mod      string
	db       *orm.DB
	dbPrefix orm.Prefix

	admin    *admin.Admin
	health   *health.Health
	linkages *rootLinkage
}

func New(mod string, s *web.Server, db *orm.DB, r *web.Router, adminM *admin.Admin) (*System, error) {
	m := &System{
		mod:      mod,
		db:       db,
		dbPrefix: orm.Prefix(mod),

		admin:  adminM,
		health: health.New(health.NewCacheStore(s, mod+"_health")),
	}

	r.Use(m.health)

	lg, err := newRootLinkage(m.db, m.dbPrefix)
	if err != nil {
		return nil, err
	}
	m.linkages = lg

	rg := adminM.GetResourceGroup(admin.ResourceID)
	rg.AddResources(map[string]web.LocaleStringer{
		resGetInfo:     web.Phrase("view system info"),
		resGetServices: web.Phrase("view services"),
		resGetAPIs:     web.Phrase("view apis"),
		resGetSettings: web.Phrase("view settings"),
		resGetLinkages: web.Phrase("view linkages"),
	})

	r.Prefix(m.admin.URLPrefix(), web.MiddlewareFunc(m.admin.AuthFilter)).
		Get("/system/info", m.admin.RBACFilter(mod, resGetInfo, m.adminGetInfo)).
		Get("/system/services", m.admin.RBACFilter(mod, resGetServices, m.adminGetServices)).
		Get("/system/apis", m.admin.RBACFilter(mod, resGetAPIs, m.adminGetAPIs)).
		Get("/system/linkages/{id}", m.admin.RBACFilter(mod, resGetLinkages, m.adminGetLinkages))

	r.Get("/system/problems", m.commonGetProblems)

	return m, nil
}
