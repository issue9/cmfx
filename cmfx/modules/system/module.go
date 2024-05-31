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
	"github.com/issue9/cmfx/cmfx/user/settings"
)

type Module struct {
	mod     *cmfx.Module
	admin   *admin.Module
	health  *health.Health
	monitor *monitor.Monitor

	settings        *settings.Settings
	generalSettings *settings.Object[generalSettings]
	censorSettings  *settings.Object[censorSettings]

	// 可能为空
	buildBackupFilename func(time.Time) string
}

// Load 加载当前模块
//
// conf 当前模块的配置项，需要调用者自先调用 [Config.SanitizeConfig] 对数据进行校正；
func Load(mod *cmfx.Module, conf *Config, adminL *admin.Module) *Module {
	store, err := newHealthDBStore(mod)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}

	m := &Module{
		mod:      mod,
		admin:    adminL,
		health:   health.New(store),
		monitor:  monitor.New(mod.Server(), 30*time.Second),
		settings: settings.New(mod, settingsTableName),
	}

	mod.Server().Use(m.health)

	g := adminL.NewResourceGroup(mod)
	resGetInfo := g.New("get-info", web.Phrase("view system info"))
	resGetServices := g.New("get-services", web.Phrase("view services"))
	resGetAPIs := g.New("get-apis", web.Phrase("view apis"))
	resBackup := g.New("backup", web.Phrase("backup database"))
	resSettingsGeneral := g.New("setting-general", web.Phrase("general setting"))
	resSettingsCensor := g.New("setting-censor", web.Phrase("censor setting"))

	adminRouter := mod.Router().Prefix(adminL.URLPrefix()+conf.URLPrefix, m.admin)
	adminRouter.Get("/info", m.adminGetInfo, resGetInfo).
		Get("/services", m.adminGetServices, resGetServices).
		Get("/apis", m.adminGetAPIs, resGetAPIs).
		Get("/monitor", m.adminGetMonitor, resGetInfo).
		Get("/settings/general", m.adminGetSettingGeneral, resSettingsGeneral).
		Put("/settings/general", m.adminPutSettingGeneral, resSettingsGeneral).
		Get("/settings/censor", m.adminGetSettingCensor, resSettingsCensor).
		Put("/settings/censor", m.adminPutSettingCensor, resSettingsCensor)

	mod.Router().Prefix(conf.URLPrefix).Get("/problems", m.commonGetProblems)
	mod.Router().Prefix(adminL.URLPrefix()).Prefix(conf.URLPrefix).Get("/env", m.adminGetEnv)

	if conf.Backup != nil {
		m.buildBackupFilename = conf.Backup.buildFile

		mod.Server().Services().AddCron(web.Phrase("backup database"), func(now time.Time) error {
			return mod.DB().Backup(m.buildBackupFilename(now))
		}, conf.Backup.Cron, true)

		adminRouter.Get("/backup", m.adminPostBackup, resBackup)
	}

	return m
}
