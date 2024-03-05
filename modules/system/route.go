// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package system

import (
	"runtime"
	"time"

	"github.com/issue9/web"
)

// # api get /system/apis API 信息
// @tag system admin
// @resp 200 * []github.com/issue9/middleware/v6/health.State
func (s *System) adminGetAPIs(*web.Context) web.Responser {
	return web.OK(s.health.States())
}

type dbInfo struct {
	Name               string        `json:"name" xml:"name"`
	Version            string        `json:"version" xml:"version"`
	MaxOpenConnections int           `json:"maxOpenConnections" xml:"maxOpenConnections"`                   // 连接数
	OpenConnections    int           `json:"openConnections" xml:"openConnections"`                         // 总的连接数
	InUse              int           `json:"inUse" xml:"inUse"`                                             // 当前的连接数
	Idle               int           `json:"idle" xml:"idle"`                                               // 空闲的连接
	WaitCount          int64         `json:"waitCount" xml:"waitCount"`                                     // 等待的连接
	WaitDuration       time.Duration `json:"waitDuration" xml:"waitDuration"`                               // 新连接的平均等待时间
	MaxIdleClosed      int64         `json:"maxIdleClosed" xml:"maxIdleClosed"`                             // 最大空闲联接
	MaxIdleTimeClosed  int64         `json:"maxIdleTimeClosed,omitempty" xml:"maxIdleTimeClosed,omitempty"` // The total number of connections closed due to SetConnMaxIdleTime.
	MaxLifetimeClosed  int64         `json:"maxLifetimeClosed" xml:"maxLifetimeClosed"`                     // 最生命周期联接
}

type info struct {
	XMLName string `json:"-" xml:"info"`

	Name       string  `json:"name" xml:"name"`
	Version    string  `json:"version" xml:"version"`
	Uptime     string  `json:"uptime" xml:"uptime"`
	Go         string  `json:"go" xml:"go"`
	OS         string  `json:"os" xml:"os"`
	Arch       string  `json:"arch" xml:"arch"`
	CPUS       int     `json:"cpus" xml:"cpus"`
	Goroutines int     `json:"goroutines" xml:"goroutines"`
	DB         *dbInfo `json:"db" xml:"db"`
}

// # api get /system/info 系统信息
// @tag system admin
// @resp 200 * info
func (s *System) adminGetInfo(ctx *web.Context) web.Responser {
	dbVersion, err := s.DB().Version()
	if err != nil {
		return ctx.Error(err, "")
	}
	stats := s.DB().Stats()
	srv := ctx.Server()

	return web.OK(&info{
		Name:       srv.Name(),
		Version:    srv.Version(),
		Uptime:     ctx.Server().Uptime().Format(time.RFC3339),
		Go:         runtime.Version(),
		OS:         runtime.GOOS,
		Arch:       runtime.GOARCH,
		CPUS:       runtime.NumCPU(),
		Goroutines: runtime.NumGoroutine(),
		DB: &dbInfo{
			Name:               s.DB().Dialect().DBName(),
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

type service struct {
	Title string    `json:"title" xml:"title"`
	State web.State `json:"state" xml:"state,attr"`
	Err   string    `json:"err,omitempty" xml:"err,omitempty"`
}
type job struct {
	service
	Next time.Time `json:"next,omitempty" xml:"next,omitempty"`
	Prev time.Time `json:"prev,omitempty" xml:"prev,omitempty"`
}
type services struct {
	XMLName  struct{}  `json:"-" xml:"services"`
	Services []service `json:"services" xml:"service"`
	Jobs     []job     `json:"jobs" xml:"job"`
}

// # api get /system/services 系统服务状态
// @tag system admin
// @resp 200 * services
func (s *System) adminGetServices(ctx *web.Context) web.Responser {

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
		ss.Jobs = append(ss.Jobs, job{
			service: service{
				Title: j.Title().LocaleString(ctx.LocalePrinter()),
				State: j.State(),
				Err:   j.Err().Error(),
			},
			Next: j.Next(),
			Prev: j.Prev(),
		})
	})

	return web.OK(ss)
}

type problem struct {
	Prefix string `json:"prefix" xml:"prefix"`
	ID     string `json:"id" xml:"id"`
	Status int    `json:"status" xml:"status,attr"`
	Title  string `json:"title" xml:"title"`
	Detail string `json:"detail" xml:"detail"`
}

// # api get /problems 系统错误信息
// @tag system
// @resp 200 * []problem
func (s *System) commonGetProblems(ctx *web.Context) web.Responser {

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
