// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"time"

	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/handlers/monitor"
	"github.com/issue9/webuse/v7/plugins/health"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
)

type Loader struct {
	mod     *cmfx.Module
	admin   *admin.Loader
	health  *health.Health
	monitor *monitor.Monitor

	// 可能为空
	buildBackupFilename func(time.Time) string
}

// Load 加载当前模块
//
// conf 当前模块的配置项，需要调用者自先调用 [Config.SanitizeConfig] 对数据进行校正；
func Load(mod *cmfx.Module, conf *Config, adminL *admin.Loader) *Loader {
	store, err := newHealthDBStore(mod)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := &Loader{
		mod:     mod,
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
	restBackup := g.New("backup", web.Phrase("backup database"))

	adminRouter := mod.Router().Prefix(adminL.URLPrefix()+conf.URLPrefix, web.MiddlewareFunc(m.admin.AuthFilter))
	adminRouter.Get("/info", resGetInfo(m.adminGetInfo)).
		Get("/services", resGetServices(m.adminGetServices)).
		Get("/apis", resGetAPIs(m.adminGetAPIs)).
		Get("/monitor", resGetInfo(m.adminGetMonitor))

	mod.Router().Prefix(conf.URLPrefix).Get("/problems", m.commonGetProblems)

	if conf.Backup != nil {
		m.buildBackupFilename = conf.Backup.buildFile

		mod.Server().Services().AddCron(web.Phrase("backup database"), func(now time.Time) error {
			return mod.DB().Backup(m.buildBackupFilename(now))
		}, conf.Backup.Cron, true)

		adminRouter.Get("/backup", restBackup(m.adminPostBackup))
	}

	return m
}
