// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/plugins/health"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
)

type Loader struct {
	*cmfx.Module
	admin  *admin.Loader
	health *health.Health
}

func Load(mod *cmfx.Module, adminL *admin.Loader) *Loader {
	store, err := newHealthDBStore(mod)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := &Loader{
		Module: mod,
		admin:  adminL,
		health: health.New(store),
	}

	mod.Server().Use(m.health)
	m.health.Fill(mod.Server())

	g := adminL.ResourceGroup()
	resGetInfo := g.New("get-info", web.Phrase("view system info"))
	resGetServices := g.New("get-services", web.Phrase("view services"))
	resGetAPIs := g.New("get-apis", web.Phrase("view apis"))

	mod.Router().Prefix(adminL.URLPrefix(), web.MiddlewareFunc(m.admin.AuthFilter)).
		Get("/system/info", resGetInfo(m.adminGetInfo)).
		Get("/system/services", resGetServices(m.adminGetServices)).
		Get("/system/apis", resGetAPIs(m.adminGetAPIs))

	mod.Router().Get("/system/problems", m.commonGetProblems)

	return m
}
