// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package system 系统设置及相关功能
package system

import (
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/handlers/monitor"
	"github.com/issue9/webuse/v7/plugins/health"
	"time"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
)

type Loader struct {
	*cmfx.Module
	admin   *admin.Loader
	health  *health.Health
	monitor *monitor.Monitor
}

func Load(mod *cmfx.Module, adminL *admin.Loader) *Loader {
	store, err := newHealthDBStore(mod)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := &Loader{
		Module:  mod,
		admin:   adminL,
		health:  health.New(store),
		monitor: monitor.New(mod.Server(), 30*time.Second),
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
		Get("/system/apis", resGetAPIs(m.adminGetAPIs)).
		Get("/system/monitor", resGetInfo(m.adminGetMonitor))

	mod.Router().Get("/system/problems", m.commonGetProblems)

	return m
}
