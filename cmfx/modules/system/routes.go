// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/fxamacker/cbor/v2"
	"github.com/issue9/web"
	"github.com/issue9/web/locales"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/services/systat"
	"github.com/shirou/gopsutil/v4/host"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
)

func (m *Module) adminGetAPIs(_ *web.Context) web.Responser { return web.OK(m.health.States()) }

// 数据库的基本信息
type dbVO struct {
	Name               string        `json:"name" xml:"name" cbor:"name" yaml:"name"`                                                         // 数据库驱动
	Version            string        `json:"version" xml:"version" cbor:"version" yaml:"version"`                                             // 数据库版本
	MaxOpenConnections int           `json:"maxOpenConnections" xml:"maxOpenConnections" cbor:"maxOpenConnections" yaml:"maxOpenConnections"` // 连接数
	OpenConnections    int           `json:"openConnections" xml:"openConnections" cbor:"openConnections" yaml:"openConnections"`             // 总的连接数
	InUse              int           `json:"inUse" xml:"inUse" cbor:"inUse" yaml:"inUse"`                                                     // 当前的连接数
	Idle               int           `json:"idle" xml:"idle" cbor:"idle" yaml:"idle"`                                                         // 空闲的连接
	WaitCount          int64         `json:"waitCount" xml:"waitCount" cbor:"waitCount" yaml:"waitCount"`                                     // 等待的连接
	WaitDuration       time.Duration `json:"waitDuration" xml:"waitDuration" cbor:"waitDuration" yaml:"waitDuration" openapi:"string"`        // 新连接的平均等待时间
	MaxIdleClosed      int64         `json:"maxIdleClosed" xml:"maxIdleClosed" cbor:"maxIdleClosed" yaml:"maxIdleClosed"`                     // 最大空闲联接
	MaxLifetimeClosed  int64         `json:"maxLifetimeClosed" xml:"maxLifetimeClosed" cbor:"maxLifetimeClosed" yaml:"maxLifetimeClosed"`     // 最生命周期联接

	// The total number of connections closed due to SetConnMaxIdleTime.
	MaxIdleTimeClosed int64 `json:"maxIdleTimeClosed,omitempty" xml:"maxIdleTimeClosed,omitempty" cbor:"maxIdleTimeClosed,omitempty" yaml:"maxIdleTimeClosed,omitempty"`
}

// 系统信息
type infoVO struct {
	XMLName    struct{} `json:"-" xml:"info" cbor:"-" yaml:"-"`
	ID         string   `json:"id" xml:"id" cbor:"id" yaml:"id"`                                 // 应用名称
	Version    string   `json:"version" xml:"version" cbor:"version" yaml:"version"`             // 应用版本号
	Uptime     string   `json:"uptime" xml:"uptime" cbor:"uptime" yaml:"uptime"`                 // 应用的上次启动时间
	Go         string   `json:"go" xml:"go" cbor:"go" yaml:"go"`                                 // 编译器的版本
	OS         *osVO    `json:"os" xml:"os" cbor:"os" yaml:"os"`                                 // 系统信息
	Arch       string   `json:"arch" xml:"arch" cbor:"arch" yaml:"arch"`                         // CPU 架构
	CPUS       int      `json:"cpus" xml:"cpus" cbor:"cpus" yaml:"cpus"`                         // CPU 核心数量
	Goroutines int      `json:"goroutines" xml:"goroutines" cbor:"goroutines" yaml:"goroutines"` // 当前运行的协程数量
	DB         *dbVO    `json:"db" xml:"db" cbor:"db" yaml:"db"`                                 // 数据库的相关信息
}

type osVO struct {
	Platform string    `json:"platform" xml:"platform" cbor:"platform" yaml:"platform"`
	Family   string    `json:"family" xml:"family" cbor:"family" yaml:"family"`
	Version  string    `json:"version" xml:"version" cbor:"version" yaml:"version"`
	Boot     time.Time `json:"boot" xml:"boot" cbor:"boot" yaml:"boot"` // 系统的开机时间
}

func (m *Module) adminGetInfo(ctx *web.Context) web.Responser {
	dbVersion := m.mod.DB().Version()
	stats := m.mod.DB().Stats()
	srv := ctx.Server()

	platform, family, version, err := host.PlatformInformation()
	if err != nil {
		srv.Logs().ERROR().Error(err)
		platform = runtime.GOOS
	}

	boot, err := host.BootTime()
	if err != nil {
		srv.Logs().ERROR().Error(err)
	}

	return web.OK(&infoVO{
		ID:      srv.ID(),
		Version: srv.Version(),
		Uptime:  ctx.Server().Uptime().Format(time.RFC3339),
		Go:      runtime.Version(),
		OS: &osVO{
			Platform: platform,
			Family:   family,
			Version:  version,
			Boot:     time.Unix(int64(boot), 0),
		},
		Arch:       runtime.GOARCH,
		CPUS:       runtime.NumCPU(),
		Goroutines: runtime.NumGoroutine(),
		DB: &dbVO{
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

type state web.State

var stateStrings = map[web.State]string{
	web.Stopped: "stopped",
	web.Running: "running",
	web.Failed:  "failed",
}

func (s state) MarshalText() ([]byte, error) {
	if v, found := stateStrings[web.State(s)]; found {
		return []byte(v), nil
	}
	return nil, locales.ErrInvalidValue()
}

func (s state) MarshalCBOR() ([]byte, error) {
	if v, found := stateStrings[web.State(s)]; found {
		return cbor.Marshal(v)
	}
	return nil, locales.ErrInvalidValue()
}

func (state) OpenAPISchema(s *openapi.Schema) {
	s.Type = openapi.TypeString
	s.Enum = []any{"stopped", "running", "failed"}
}

// 服务
type serviceVO struct {
	Title string `json:"title" xml:"title" cbor:"title" yaml:"title"`                                 // 名称
	State state  `json:"state" xml:"state,attr" cbor:"state" yaml:"state"`                            // 状态
	Err   string `json:"err,omitempty" xml:"err,omitempty" cbor:"err,omitempty" yaml:"err,omitempty"` // 如果出错，表示错误内容，否则为空
}

// 计划任务
type jobVO struct {
	serviceVO `yaml:",inline"`
	Next      time.Time `json:"next,omitzero" xml:"next,omitzero" cbor:"next,omitzero" yaml:"next,omitempty"` // 下一次执行时间
	Prev      time.Time `json:"prev,omitzero" xml:"prev,omitzero" cbor:"prev,omitzero" yaml:"prev,omitempty"` // 上一次执行时间
}

// 服务和计划任务
type servicesVO struct {
	XMLName  struct{}    `json:"-" xml:"services" cbor:"-" yaml:"-"`
	Services []serviceVO `json:"services" xml:"services>service" cbor:"services" yaml:"services"` // 服务
	Jobs     []jobVO     `json:"jobs" xml:"jobs>job" cbor:"jobs" yaml:"jobs"`                     // 计划任务
}

func (m *Module) adminGetServices(ctx *web.Context) web.Responser {
	ss := servicesVO{}
	ctx.Server().Services().Visit(func(title web.LocaleStringer, s web.State, err error) {
		var err1 string
		if err != nil {
			err1 = err.Error()
		}

		ss.Services = append(ss.Services, serviceVO{
			Title: title.LocaleString(ctx.LocalePrinter()),
			State: state(s),
			Err:   err1,
		})
	})

	ctx.Server().Services().VisitJobs(func(j *web.Job) {
		var err string
		if j.Err() != nil {
			err = j.Err().Error()
		}

		ss.Jobs = append(ss.Jobs, jobVO{
			serviceVO: serviceVO{
				Title: j.Title().LocaleString(ctx.LocalePrinter()),
				State: state(j.State()),
				Err:   err,
			},
			Next: j.Next(),
			Prev: j.Prev(),
		})
	})

	return web.OK(ss)
}

// 错误信息
type problemVO struct {
	XMLName struct{} `json:"-" cbor:"-" yaml:"-" xml:"problem"`
	Prefix  string   `json:"prefix" xml:"prefix" cbor:"prefix" yaml:"prefix"`      // URL 前缀以，如果此值不为空，与 ID 组成一上完整的地址。
	ID      string   `json:"id" xml:"id" cbor:"id" yaml:"id"`                      // 唯一 ID
	Status  int      `json:"status" xml:"status,attr" cbor:"status" yaml:"status"` // 对应的原始 HTTP 状态码
	Title   string   `json:"title" xml:"title" cbor:"title" yaml:"title"`          // 错误的简要描述
	Detail  string   `json:"detail" xml:"detail" cbor:"detail" yaml:"detail"`      // 错误的明细
}

func (m *Module) commonGetProblems(ctx *web.Context) web.Responser {
	ps := make([]*problemVO, 0, 100)
	for status, p := range ctx.Server().Problems().Problems() {
		ps = append(ps, &problemVO{
			ID:     p.ID,
			Status: status,
			Title:  p.Title.LocaleString(ctx.LocalePrinter()),
			Detail: p.Detail.LocaleString(ctx.LocalePrinter()),
		})
	}

	return web.OK(ps)
}

func (m *Module) adminPostSystat(ctx *web.Context) web.Responser {
	uid := m.admin.CurrentUser(ctx).ID
	s := m.admin.SSE().Get(uid)
	if s == nil {
		return ctx.Problem(cmfx.PreconditionFailedNeedSSE)
	}

	e := s.NewEvent("systat", json.Marshal)

	cancel := m.stats.Subscribe(func(data *systat.Stats) {
		if err := e.Sent(data); err != nil {
			m.admin.UserModule().Module().Server().Logs().ERROR().Error(err)
		}
	})
	m.cancels[uid] = cancel

	return web.Created(nil, "")
}

func (m *Module) adminDeleteSystat(ctx *web.Context) web.Responser {
	uid := m.admin.CurrentUser(ctx).ID
	if c, found := m.cancels[uid]; found {
		c()
		delete(m.cancels, uid)
	}
	return web.NoContent()
}

func (m *Module) adminPostBackup(ctx *web.Context) web.Responser {
	if err := m.mod.DB().Backup(m.backupConfig.buildFile(ctx.Begin())); err != nil {
		return ctx.Error(err, web.ProblemInternalServerError)
	}
	return web.Created(nil, "")
}

func (m *Module) adminDeleteBackup(ctx *web.Context) web.Responser {
	p, resp := ctx.PathString("name", "")
	if resp != nil {
		return resp
	}

	// 防止用户传递 ../ 等格式的数据以造成误删。
	// 配置中已经限制了备份文件不能包含目录结构。
	if strings.ContainsAny(p, "/"+string(os.PathSeparator)) {
		return ctx.NotFound()
	}

	if err := os.Remove(filepath.Join(m.backupConfig.Dir, p)); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

type backupListVO struct {
	XMLName struct{}        `json:"-" xml:"backup" cbor:"-" yaml:"-"`
	Cron    string          `json:"cron" xml:"cron" cbor:"cron" yaml:"cron"`
	List    []*backupFileVO `json:"list" xml:"list" cbor:"list" yaml:"list"`
}

type backupFileVO struct {
	Path string    `json:"path" xml:"path" cbor:"path" yaml:"path"`
	Size int       `json:"size" xml:"size" cbor:"size" yaml:"size"`
	Mod  time.Time `json:"mod" xml:"mod" cbor:"mod" yaml:"mod"`
}

func (m *Module) adminGetBackup(ctx *web.Context) web.Responser {
	entries, err := os.ReadDir(m.backupConfig.Dir)
	if err != nil {
		return ctx.Error(err, "")
	}

	list := make([]*backupFileVO, 0, len(entries))
	for _, e := range entries {
		if !e.IsDir() {
			info, err := e.Info()
			if err != nil {
				ctx.Server().Logs().ERROR().Error(err)
				list = append(list, &backupFileVO{Path: e.Name()})
				continue
			}
			list = append(list, &backupFileVO{Path: e.Name(), Mod: info.ModTime(), Size: int(info.Size())})
		}
	}

	return web.OK(&backupListVO{
		Cron: m.backupConfig.Cron,
		List: list,
	})
}

func (m *Module) adminGetSettingGeneral(ctx *web.Context) web.Responser {
	return m.generalSettings.HandleGet(ctx, user.SpecialUserID)
}

func (m *Module) adminPutSettingGeneral(ctx *web.Context) web.Responser {
	return m.generalSettings.HandlePut(ctx, user.SpecialUserID)
}

func (m *Module) adminGetSettingAudit(ctx *web.Context) web.Responser {
	return m.auditSettings.HandleGet(ctx, user.SpecialUserID)
}

func (m *Module) adminPutSettingAudit(ctx *web.Context) web.Responser {
	return m.auditSettings.HandlePut(ctx, user.SpecialUserID)
}
