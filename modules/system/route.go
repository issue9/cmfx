// SPDX-License-Identifier: MIT

package system

import (
	"runtime"
	"time"

	"github.com/issue9/web"
)

// <api method="get" summary="系统信息">
//
//	<server>admin</server>
//	<tag>system</tag>
//	<path path="/system/apis" />
//	<response status="200" summary="OK" type="object" array="true">
//	    <param name="method" type="string" summary="请求方法" />
//	    <param name="path" type="string" summary="path" />
//	    <param name="min" type="string" summary="最快的一次请求用时" />
//	    <param name="max" type="string" summary="最慢的一次请求用时" />
//	    <param name="userErrors" type="number" summary="返回 400-499 次数" />
//	    <param name="serverErrors" type="number" summary="返回 500-599 次数" />
//	    <param name="last" type="string" summary="末次请求时间" />
//	    <param name="spend" type="string" summary="总的花费时间" />
//	    <param name="count" type="number" summary="请求次数" />
//	</response>
//
// </api>
func (s *System) adminGetAPIs(*web.Context) web.Responser {
	type state struct {
		XMLName struct{} `json:"-" xml:"states"`

		Method       string        `json:"method" xml:"method,attr"`
		Path         string        `json:"path" xml:"path"`
		Min          time.Duration `json:"min" xml:"min,attr"`
		Max          time.Duration `json:"max" xml:"max,attr"`
		Count        int           `json:"count" xml:"count,attr"`
		UserErrors   int           `json:"userErrors" xml:"userErrors,attr"`     // 用户端出错次数，400-499
		ServerErrors int           `json:"serverErrors" xml:"serverErrors,attr"` // 服务端出错次数，>500
		Last         time.Time     `json:"last" xml:"last"`                      // 最后的访问时间
		Spend        time.Duration `json:"spend" xml:"spend"`                    // 总花费的时间
	}

	states := s.health.States()
	resp := make([]*state, 0, len(states))
	for _, s := range states {
		resp = append(resp, &state{
			Method:       s.Method,
			Path:         s.Path,
			Min:          s.Min,
			Max:          s.Max,
			Count:        s.Count,
			UserErrors:   s.UserErrors,
			ServerErrors: s.ServerErrors,
			Last:         s.Last,
			Spend:        s.Spend,
		})
	}
	return web.OK(resp)
}

// <api method="get" summary="系统信息">
//
//	<server>admin</server>
//	<tag>system</tag>
//	<path path="/system/info" />
//	<response status="200" summary="OK" type="object">
//	    <param name="name" type="string" summary="程序名称" />
//	    <param name="version" type="string" summary="程序版本" />
//	    <param name="go" type="string" summary="Go 的版本" />
//	    <param name="arch" type="string" summary="系统架构" />
//	    <param name="cpus" type="number" summary="CPU 核心数量" />
//	    <param name="goroutines" type="number" summary="当前协程数量" />
//	    <param name="uptime" type="string" summary="上线时间" />
//	    <param name="db" type="object" summary="数据库状态">
//	        <param name="name" type="string" summary="数据库名称" />
//	        <param name="version" type="string" summary="数据库版本" />
//	        <param name="maxOpenConnections" type="number" summary="总的连接数" />
//	        <param name="openConnections" type="number" summary="连接数" />
//	        <param name="inUse" type="number" summary="当前的连接数" />
//	        <param name="idle" type="number" summary="空闲的连接" />
//	        <param name="waitCount" type="number" summary="等待的连接" />
//	        <param name="waitDuration" type="number" summary="新连接的平均等待时间" />
//	        <param name="maxIdleClosed" type="number" summary="最大空闲联接" />
//	        <param name="maxIdleIdleClosed" type="number" summary="The total number of connections closed due to SetConnMaxIdleTime" />
//	        <param name="maxLifetimeClosed" type="number" summary="最大生命周期联接" />
//	    </param>
//	</response>
//
// </api>
func (s *System) adminGetInfo(ctx *web.Context) web.Responser {
	dbVersion, err := s.db.Version()
	if err != nil {
		return ctx.InternalServerError(err)
	}
	stats := s.db.Stats()
	srv := ctx.Server()

	type db struct {
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

		Name       string `json:"name" xml:"name"`
		Version    string `json:"version" xml:"version"`
		Uptime     string `json:"uptime" xml:"uptime"`
		Go         string `json:"go" xml:"go"`
		OS         string `json:"os" xml:"os"`
		Arch       string `json:"arch" xml:"arch"`
		CPUS       int    `json:"cpus" xml:"cpus"`
		Goroutines int    `json:"goroutines" xml:"goroutines"`
		DB         *db    `json:"db" xml:"db"`
	}

	return web.OK(&info{
		Name:       srv.Name(),
		Version:    srv.Version(),
		Uptime:     ctx.Server().Uptime().Format(time.RFC3339),
		Go:         runtime.Version(),
		OS:         runtime.GOOS,
		Arch:       runtime.GOARCH,
		CPUS:       runtime.NumCPU(),
		Goroutines: runtime.NumGoroutine(),
		DB: &db{
			Name:               s.db.Dialect().DBName(),
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

// <api method="get" summary="系统服务状态">
//
//	<server>admin</server>
//	<tag>system</tag>
//	<path path="/system/services" />
//	<response status="200" summary="OK" type="object">
//	    <param name="services" type="object" array="true" summary="服务列表">
//	        <param name="title" type="string" summary="名称" />
//	        <param name="state" type="string" summary="状态">
//	            <enum value="stopped" summary="未运行" />
//	            <enum value="running" summary="正常运行中" />
//	            <enum value="failed" summary="出错，错误信息可查看 err 字段。" />
//	        </param>
//	        <param name="err" type="string" summary="出错信息" />
//	    </param>
//	    <param name="jobs" type="object" array="true" summary="计划任务列表">
//	        <param name="title" type="string" summary="名称" />
//	        <param name="state" type="string" summary="状态">
//	            <enum value="stopped" summary="未运行" />
//	            <enum value="running" summary="正常运行中" />
//	            <enum value="failed" summary="出错，错误信息可查看 err 字段。" />
//	        </param>
//	        <param name="err" type="string" summary="出错信息" />
//	        <param name="next" type="string.datetime" summary="下次执行时间" />
//	        <param name="prev" type="string.datetime" summary="上次执行时间" />
//	    </param>
//	</response>
//
// </api>
func (s *System) adminGetServices(ctx *web.Context) web.Responser {
	type service struct {
		Title string `json:"title" xml:"title"`
		State string `json:"state" xml:"state,attr"`
		Err   string `json:"err,omitempty" xml:"err,omitempty"`
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

	ss := services{}
	for _, s := range ctx.Server().Services().Services() {
		var err string
		if s.Err() != nil {
			err = s.Err().Error()
		}

		ss.Services = append(ss.Services, service{
			Title: s.Title(ctx.LocalePrinter()),
			State: s.State().String(),
			Err:   err,
		})
	}
	for _, j := range ctx.Server().Services().Jobs() {
		var err string
		if j.Err() != nil {
			err = j.Err().Error()
		}

		ss.Jobs = append(ss.Jobs, job{
			service: service{
				Title: j.Name(),
				State: j.State().String(),
				Err:   err,
			},
			Next: j.Next(),
			Prev: j.Prev(),
		})
	}

	return web.OK(ss)
}

// <api method="GET" summary="系统错误信息">
//
//	<server>common</server>
//	<tag>system</tag>
//	<path path="/problems" />
//	<response type="object" status="200">
//	    <param name="id" type="string" summary="错误编号的键值对" />
//	</response>
//
// </api>
func (s *System) commonGetProblems(ctx *web.Context) web.Responser {
	type problem struct {
		ID     string `json:"id" xml:"id"`
		Status int    `json:"status" xml:"status,attr"`
		Title  string `json:"title" xml:"title"`
		Detail string `json:"detail" xml:"detail"`
	}

	pp := ctx.Server().Problems()
	ps := make([]*problem, 0, 100)
	for _, p := range pp.Problems() {
		ps = append(ps, &problem{
			ID:     p.ID,
			Status: p.Status,
			Title:  p.Title.LocaleString(ctx.LocalePrinter()),
			Detail: p.Detail.LocaleString(ctx.LocalePrinter()),
		})
	}

	return web.OK(map[string]any{
		"base":     pp.TypePrefix(),
		"problems": ps,
	})
}
