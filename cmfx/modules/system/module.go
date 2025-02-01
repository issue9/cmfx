// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"context"
	"time"

	"github.com/issue9/events"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/plugins/health"
	"github.com/issue9/webuse/v7/services/systat"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/modules/admin"
	"github.com/issue9/cmfx/cmfx/user/settings"
)

type Module struct {
	mod    *cmfx.Module
	admin  *admin.Module
	health *health.Health

	stats   events.Subscriber[*systat.Stats]
	cancels map[int64]context.CancelFunc

	settings        *settings.Settings
	generalSettings *settings.Object[generalSettings]
	censorSettings  *settings.Object[censorSettings]

	// 若配置中未设置，则以下字段为空
	backupConfig *Backup
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
		mod:    mod,
		admin:  adminL,
		health: health.New(store),

		stats:   systat.Init(mod.Server(), time.Minute, time.Second, 20),
		cancels: map[int64]context.CancelFunc{},

		settings: settings.New(mod, settingsTableName),
	}
	general, err := settings.LoadObject[generalSettings](m.settings, generalSettingName)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	m.generalSettings = general

	censor, err := settings.LoadObject[censorSettings](m.settings, censorSettingName)
	if err != nil {
		panic(web.SprintError(mod.Server().Locale().Printer(), true, err))
	}
	m.censorSettings = censor

	mod.Server().Use(m.health)

	g := adminL.NewResourceGroup(mod)
	resGetInfo := g.New("get-info", web.Phrase("view system info"))
	resGetStat := g.New("get-stat", web.Phrase("view system stat"))
	resGetServices := g.New("get-services", web.Phrase("view services"))
	resGetAPIs := g.New("get-apis", web.Phrase("view apis"))
	resBackup := g.New("backup", web.Phrase("backup database"))
	resGetBackup := g.New("get-backup", web.Phrase("get backup database list"))
	resDelBackup := g.New("del-backup", web.Phrase("del backup database file"))
	resSettingsGeneral := g.New("setting-general", web.Phrase("general setting"))
	resSettingsCensor := g.New("setting-censor", web.Phrase("censor setting"))

	api := adminL.UserModule().Module().API
	r := adminL.UserModule().Module().Router().Prefix(adminL.URLPrefix()+conf.URLPrefix, m.admin)
	r.Get("/info", m.adminGetInfo, resGetInfo, api(func(o *openapi.Operation) {
		o.Tag("system").
			Response200(infoVO{}).
			Desc(web.Phrase("get system info api"), nil)
	})).
		Get("/services", m.adminGetServices, resGetServices, mod.API(func(o *openapi.Operation) {
			o.Tag("system").
				Response200(servicesVO{}).
				Desc(web.Phrase("get services list api"), nil)
		})).
		Get("/apis", m.adminGetAPIs, resGetAPIs, api(func(o *openapi.Operation) {
			o.Tag("system").
				Response200([]health.State{}).
				Desc(web.Phrase("get api list api"), nil)
		})).
		Post("/systat", m.adminPostSystat, resGetStat, mod.API(func(o *openapi.Operation) {
			o.Tag("system", "systat", "sse").
				Desc(web.Phrase("subscribe system stat api"), nil).
				ResponseEmpty("201")
		})).
		Delete("/systat", m.adminDeleteSystat, resGetStat, mod.API(func(o *openapi.Operation) {
			o.Tag("system", "systat", "sse").
				Desc(web.Phrase("unsubscribe system stat api"), nil).
				ResponseEmpty("204")
		})).
		Get("/settings/general", m.adminGetSettingGeneral, resSettingsGeneral, mod.API(func(o *openapi.Operation) {
			o.Tag("settings", "system").
				Response200(generalSettings{})
		})).
		Put("/settings/general", m.adminPutSettingGeneral, resSettingsGeneral, mod.API(func(o *openapi.Operation) {
			o.Tag("settings", "system").
				Body(generalSettings{}, false, nil, nil).
				ResponseEmpty("204")
		})).
		Get("/settings/censor", m.adminGetSettingCensor, resSettingsCensor, mod.API(func(o *openapi.Operation) {
			o.Tag("settings", "system").
				Response200(censorSettings{})
		})).
		Put("/settings/censor", m.adminPutSettingCensor, resSettingsCensor, mod.API(func(o *openapi.Operation) {
			o.Tag("settings", "system").
				Body(censorSettings{}, false, nil, nil).
				ResponseEmpty("204")
		}))

	mod.Router().Prefix(conf.URLPrefix).Get("/problems", m.commonGetProblems, mod.OpenAPI().API(func(o *openapi.Operation) {
		o.Tag("system", "common").
			Desc(web.Phrase("get system problems api"), nil).
			Response200([]problemVO{})
	}))

	if conf.Backup != nil {
		m.backupConfig = conf.Backup

		mod.Server().Services().AddCron(web.Phrase("backup database"), func(now time.Time) error {
			return mod.DB().Backup(m.backupConfig.buildFile(now))
		}, conf.Backup.Cron, true)

		r.Post("/backup", m.adminPostBackup, resBackup, mod.API(func(o *openapi.Operation) {
			o.Tag("system").
				Desc(web.Phrase("backup api"), nil).
				ResponseEmpty("201")
		})).
			Get("/backup", m.adminGetBackup, resGetBackup, mod.API(func(o *openapi.Operation) {
				o.Tag("system").
					Desc(web.Phrase("get backup file list api"), nil).
					Response200(backupListVO{})
			})).
			Delete("/backup/{name}", m.adminDeleteBackup, resDelBackup, mod.API(func(o *openapi.Operation) {
				o.Tag("system").
					Desc(web.Phrase("delete backup file api"), nil).
					Path("name", openapi.TypeString, web.Phrase("the backup filename"), nil).
					ResponseEmpty("204")
			}))
	}

	return m
}
