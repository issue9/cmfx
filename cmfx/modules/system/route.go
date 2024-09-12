// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/issue9/web"
	"github.com/shirou/gopsutil/v4/host"

	"github.com/issue9/cmfx/cmfx/user"
)

// # api get /system/apis API 信息
// @tag system admin
// @resp 200 * []github.com/issue9/webuse/v7/plugins/health.State
func (m *Module) adminGetAPIs(_ *web.Context) web.Responser { return web.OK(m.health.States()) }

// 数据库的基本信息
type dbInfo struct {
	Name               string        `json:"name" xml:"name" cbor:"name"`                                                                      // 数据库驱动
	Version            string        `json:"version" xml:"version" cbor:"version"`                                                             // 数据库版本
	MaxOpenConnections int           `json:"maxOpenConnections" xml:"maxOpenConnections" cbor:"maxOpenConnections"`                            // 连接数
	OpenConnections    int           `json:"openConnections" xml:"openConnections" cbor:"openConnections"`                                     // 总的连接数
	InUse              int           `json:"inUse" xml:"inUse" cbor:"inUse"`                                                                   // 当前的连接数
	Idle               int           `json:"idle" xml:"idle" cbor:"idle"`                                                                      // 空闲的连接
	WaitCount          int64         `json:"waitCount" xml:"waitCount" cbor:"waitCount"`                                                       // 等待的连接
	WaitDuration       time.Duration `json:"waitDuration" xml:"waitDuration" cbor:"waitDuration"`                                              // 新连接的平均等待时间
	MaxIdleClosed      int64         `json:"maxIdleClosed" xml:"maxIdleClosed" cbor:"maxIdleClosed"`                                           // 最大空闲联接
	MaxIdleTimeClosed  int64         `json:"maxIdleTimeClosed,omitempty" xml:"maxIdleTimeClosed,omitempty" cbor:"maxIdleTimeClosed,omitempty"` // The total number of connections closed due to SetConnMaxIdleTime.
	MaxLifetimeClosed  int64         `json:"maxLifetimeClosed" xml:"maxLifetimeClosed" cbor:"maxLifetimeClosed"`                               // 最生命周期联接
}

// 系统信息
type info struct {
	XMLName string `json:"-" xml:"info" cbor:"-"`

	Name       string           `json:"name" xml:"name" cbor:"name"`                   // 应用名称
	Version    string           `json:"version" xml:"version" cbor:"version"`          // 应用版本号
	Uptime     string           `json:"uptime" xml:"uptime" cbor:"uptime"`             // 应用的上次启动时间
	Go         string           `json:"go" xml:"go" cbor:"go"`                         // 编译器的版本
	OS         *operatingSystem `json:"os" xml:"os" cbor:"os"`                         // 系统信息
	Arch       string           `json:"arch" xml:"arch" cbor:"arch"`                   // CPU 架构
	CPUS       int              `json:"cpus" xml:"cpus" cbor:"cpus"`                   // CPU 核心数量
	Goroutines int              `json:"goroutines" xml:"goroutines" cbor:"goroutines"` // 当前运行的协程数量
	DB         *dbInfo          `json:"db" xml:"db" cbor:"db"`                         // 数据库的相关信息
}

type operatingSystem struct {
	Platform string    `json:"platform" xml:"platform" cbor:"platform"`
	Family   string    `json:"family" xml:"family" cbor:"family"`
	Version  string    `json:"version" xml:"version" cbor:"version"`
	Boot     time.Time `json:"boot" xml:"boot" cbor:"boot"` // 系统的开机时间
}

// # api get /system/info 系统信息
// @tag system admin
// @resp 200 * info
func (m *Module) adminGetInfo(ctx *web.Context) web.Responser {
	dbVersion := m.mod.DB().Version()
	stats := m.mod.DB().Stats()
	srv := ctx.Server()

	platform, family, version, err := host.PlatformInformation()
	if err != nil {
		srv.Logs().ERROR().Error(err)
		platform = runtime.GOOS
	}

	boot := srv.Uptime()
	bt, err := host.BootTime()
	if err != nil {
		srv.Logs().ERROR().Error(err)
		boot = time.Unix(int64(bt), 0)
	}

	return web.OK(&info{
		Name:    srv.Name(),
		Version: srv.Version(),
		Uptime:  ctx.Server().Uptime().Format(time.RFC3339),
		Go:      runtime.Version(),
		OS: &operatingSystem{
			Platform: platform,
			Family:   family,
			Version:  version,
			Boot:     boot,
		},
		Arch:       runtime.GOARCH,
		CPUS:       runtime.NumCPU(),
		Goroutines: runtime.NumGoroutine(),
		DB: &dbInfo{
			Name:               m.mod.DB().Dialect().Name(),
			Version:            dbVersion,
			MaxOpenConnections: stats.MaxOpenConnections,
			OpenConnections:    stats.OpenConnections,
			InUse:              stats.InUse,
			Idle:               stats.Idle,
			WaitCount:          stats.WaitCount,
			WaitDuration:       stats.WaitDuration,
			MaxIdleClosed:      stats.MaxIdleClosed,
			MaxIdleTimeClosed:  stats.MaxIdleTimeClosed,
			MaxLifetimeClosed:  stats.MaxLifetimeClosed,
		},
	})
}

// 服务
type service struct {
	Title string    `json:"title" xml:"title" cbor:"title"`                         // 名称
	State web.State `json:"state" xml:"state,attr" cbor:"state"`                    // 状态
	Err   string    `json:"err,omitempty" xml:"err,omitempty" cbor:"err,omitempty"` // 如果出错，表示错误内容，否则为空
}

// 计划任务
type job struct {
	service
	Next time.Time `json:"next,omitempty" xml:"next,omitempty" cbor:"next,omitempty"` // 下一次执行时间
	Prev time.Time `json:"prev,omitempty" xml:"prev,omitempty" cbor:"prev,omitempty"` // 上一次执行时间
}

// 服务和计划任务
type services struct {
	XMLName  struct{}  `json:"-" xml:"services" cbor:"-"`
	Services []service `json:"services" xml:"service" cbor:"service"` // 服务
	Jobs     []job     `json:"jobs" xml:"job" cbor:"job"`             // 计划任务
}

// # api get /system/services 系统服务状态
// @tag system admin
// @resp 200 * services
func (m *Module) adminGetServices(ctx *web.Context) web.Responser {
	ss := services{}
	ctx.Server().Services().Visit(func(title web.LocaleStringer, state web.State, err error) {
		var err1 string
		if err != nil {
			err1 = err.Error()
		}

		ss.Services = append(ss.Services, service{
			Title: title.LocaleString(ctx.LocalePrinter()),
			State: state,
			Err:   err1,
		})
	})

	ctx.Server().Services().VisitJobs(func(j *web.Job) {
		var err string
		if j.Err() != nil {
			err = j.Err().Error()
		}

		ss.Jobs = append(ss.Jobs, job{
			service: service{
				Title: j.Title().LocaleString(ctx.LocalePrinter()),
				State: j.State(),
				Err:   err,
			},
			Next: j.Next(),
			Prev: j.Prev(),
		})
	})

	return web.OK(ss)
}

// 错误信息
type problem struct {
	XMLName struct{} `json:"-" cbor:"-" xml:"problem"`
	Prefix  string   `json:"prefix" xml:"prefix" cbor:"prefix"`      // URL 前缀以，如果此值不为空，与 ID 组成一上完整的地址。
	ID      string   `json:"id" xml:"id" cbor:"id"`                  // 唯一 ID
	Status  int      `json:"status" xml:"status,attr" cbor:"status"` // 对应的原始 HTTP 状态码
	Title   string   `json:"title" xml:"title" cbor:"title"`         // 错误的简要描述
	Detail  string   `json:"detail" xml:"detail" cbor:"detail"`      // 错误的明细
}

// # api get /system/problems 系统错误信息
// @tag common system
// @resp 200 * []problem
func (m *Module) commonGetProblems(ctx *web.Context) web.Responser {
	ps := make([]*problem, 0, 100)
	ctx.Server().Problems().Visit(func(status int, p *web.LocaleProblem) {
		ps = append(ps, &problem{
			ID:     p.ID,
			Status: status,
			Title:  p.Title.LocaleString(ctx.LocalePrinter()),
			Detail: p.Detail.LocaleString(ctx.LocalePrinter()),
		})
	})

	return web.OK(ps)
}

// # api GET /system/monitor 监视系统数据
// @tag admin system
// @resp 200 text/event-stream github.com/issue9/webuse/v7/handlers/monitor.Stats
func (m *Module) adminGetMonitor(ctx *web.Context) web.Responser { return m.monitor.Handle(ctx) }

// # api POST /system/backup 手动执行备份数据
// @tag admin system
// @resp 201 * {}
func (m *Module) adminPostBackup(ctx *web.Context) web.Responser {
	if err := m.mod.DB().Backup(m.backupConfig.buildFile(ctx.Begin())); err != nil {
		return ctx.Error(err, web.ProblemInternalServerError)
	}
	return web.Created(nil, "")
}

// # api delete /system/backup/{name} 删除指定的备份文件
// @path name string 备份文件的文件名
// @tag admin system
// @resp 204 * {}
func (m *Module) adminDeleteBackup(ctx *web.Context) web.Responser {
	p, resp := ctx.PathString("name", "")
	if resp != nil {
		return resp
	}

	if strings.ContainsAny(p, "/"+string(os.PathSeparator)) {
		return ctx.NotFound()
	}

	if err := os.Remove(filepath.Join(m.backupConfig.Dir, p)); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

type backupList struct {
	Cron string   `json:"cron" xml:"cron" cbor:"cron"`
	List []string `json:"list" xml:"list" cbor:"list"`
}

// # api GET /system/backup 获取备份数据库的文件列表
// @tag admin system
// @resp 200 * backupConfig
func (m *Module) adminGetBackup(ctx *web.Context) web.Responser {
	entries, err := os.ReadDir(m.backupConfig.Dir)
	if err != nil {
		return ctx.Error(err, "")
	}

	list := make([]string, 0, len(entries))
	for _, e := range entries {
		if !e.IsDir() {
			list = append(list, e.Name())
		}
	}

	return web.OK(&backupList{
		Cron: m.backupConfig.Cron,
		List: list,
	})
}

// # api GET /system/settings/general 获取常规的设置项
// @tag admin system settings
// @resp 200 * generalSettings
func (m *Module) adminGetSettingGeneral(ctx *web.Context) web.Responser {
	return m.generalSettings.HandleGet(ctx, user.SpecialUserID)
}

// # api PUT /system/settings/general 设置常规的设置项
// @tag admin system settings
// @req * generalSettings
// @resp 204 * {}
func (m *Module) adminPutSettingGeneral(ctx *web.Context) web.Responser {
	return m.generalSettings.HandlePut(ctx, user.SpecialUserID)
}

// # api GET /system/settings/censor 获取内容过滤的设置项
// @tag admin system settings
// @resp 200 * censorSettings
func (m *Module) adminGetSettingCensor(ctx *web.Context) web.Responser {
	return m.censorSettings.HandleGet(ctx, user.SpecialUserID)
}

// # api PUT /system/settings/censor 设置内容过滤的设置项
// @tag admin system settings
// @req * censorSettings
// @resp 204 * {}
func (m *Module) adminPutSettingCensor(ctx *web.Context) web.Responser {
	return m.censorSettings.HandlePut(ctx, user.SpecialUserID)
}
