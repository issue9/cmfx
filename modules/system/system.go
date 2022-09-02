// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/middleware/v6/health"
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/modules/admin"
	"github.com/issue9/cmfx/pkg/setting"
)

const (
	resGetInfo     = "get-info"
	resGetAPIs     = "get-apis"
	resGetServices = "get-services"
	resGetSettings = "get-settings"
	resGetLinkages = "get-linkages"
)

type System struct {
	mod      *web.Module
	db       *orm.DB
	dbPrefix orm.Prefix

	admin    *admin.Admin
	health   *health.Health
	linkages *rootLinkage

	setting *setting.Setting
}

func dbPrefix(mod *web.Module) orm.Prefix { return orm.Prefix(mod.ID()) }

func New(mod *web.Module, db *orm.DB, r *web.Router, admin *admin.Admin) (*System, error) {
	m := &System{
		mod:      mod,
		db:       db,
		dbPrefix: dbPrefix(mod),

		admin:  admin,
		health: health.New(health.NewCacheStore(mod.Server(), mod.BuildID("health"))),

		setting: setting.New(mod, db),
	}

	r.Use(m.health)

	lg, err := newRootLinkage(m.db, m.dbPrefix)
	if err != nil {
		return nil, err
	}
	m.linkages = lg

	err = m.admin.RegisterResources(mod, map[string]web.LocaleStringer{
		resGetInfo:     web.Phrase("view system info"),
		resGetServices: web.Phrase("view services"),
		resGetAPIs:     web.Phrase("view apis"),
		resGetSettings: web.Phrase("view settings"),
		resGetLinkages: web.Phrase("view linkages"),
	})
	if err != nil {
		return nil, err
	}

	r.Prefix(m.admin.URLPrefix(), web.MiddlewareFunc(m.admin.AuthFilter)).
		Get("/system/info", m.admin.RBACFilter(mod, resGetInfo, m.adminGetInfo)).
		Get("/system/services", m.admin.RBACFilter(mod, resGetServices, m.adminGetServices)).
		Get("/system/apis", m.admin.RBACFilter(mod, resGetAPIs, m.adminGetAPIs)).
		Get("/system/settings", m.admin.RBACFilter(mod, resGetSettings, m.adminGetSettings)).
		Get("/system/linkages/{id}", m.admin.RBACFilter(mod, resGetLinkages, m.adminGetLinkages))

	r.Get("/system/problems", m.commonGetProblems)

	return m, nil
}
