// SPDX-FileCopyrightText: 2022-2026 caixw
//
// SPDX-License-Identifier: MIT

// Package user 提供用户账号的相关功能
//
// user 提供了两种方式表示用户 ID：
//
//   - string 主要用于向公共区域展示的用户 ID；
//   - int64 内部使用的用户 ID，从 1 开始，由数据库自增列表示；
package user

import (
	"context"
	"net/http"
	"time"

	"github.com/issue9/cache"
	"github.com/issue9/events"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
)

// SpecialUserID 特殊的用户 ID
//
// 表示不真实存在于用户表中的用户 ID，比如 settings 由此值表示所有用户的默认设置对象。
const SpecialUserID = 0

// Users 用户账号模块
type Users struct {
	mod       *cmfx.Module
	urlPrefix string // 所有接口的 URL 前缀
	token     *tokens

	// 用户登录和注销事件
	loginEvent  *events.Event[*User]
	logoutEvent *events.Event[*User]
	addEvent    *events.Event[*User]
	delEvent    *events.Event[*User]

	passports []Passport
}

// NewUsers 声明 [Users] 对象
func NewUsers(mod *cmfx.Module, conf *Config) *Users {
	store := token.NewCacheStore[*User](cache.Prefix(mod.Server().Cache(), mod.ID()))

	m := &Users{
		mod:       mod,
		urlPrefix: conf.URLPrefix,
		token:     token.New(mod.Server(), store, conf.AccessExpired.Duration(), conf.RefreshExpired.Duration(), web.ProblemUnauthorized, nil),

		loginEvent:  events.New[*User](),
		logoutEvent: events.New[*User](),
		addEvent:    events.New[*User](),
		delEvent:    events.New[*User](),

		passports: make([]Passport, 0, 5),
	}

	mod.Router().Prefix(m.URLPrefix()).
		Get("/passports", m.getPassports, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("get passports list api"), nil).
				Response200([]passportVO{})
		}))

	mod.Router().Prefix(m.URLPrefix(), m).
		Delete("/token", m.logout, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("logout api"), nil).
				Header(header.ClearSiteData, openapi.TypeString, nil, nil).
				ResponseEmpty("204")
		})).
		Put("/token", m.refreshToken, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("refresh token api"), nil).
				Response("201", &token.Response{}, nil, nil)
		})).
		Get("/securitylog", m.getSecyLogs, mod.API(func(o *openapi.Operation) {
			o.QueryObject(queryLogTO{}, nil).
				Desc(web.Phrase("get login user security log api"), nil).
				Response200(LogVO{})
		}))

	initPassword(m)

	return m
}

func (m *Users) URLPrefix() string { return m.urlPrefix }

// GetUser 获取指定 uid 的用户
func (m *Users) GetUser(uid int64) (*User, error) {
	u := &User{ID: uid}
	found, err := m.Module().DB().Select(u)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, web.NewError(http.StatusNotFound, cmfx.ErrNotFound())
	}
	return u, nil
}

func (m *Users) GetUserByNO(no string) (*User, error) {
	u := &User{NO: no}
	found, err := m.Module().DB().Select(u)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, web.NewError(http.StatusNotFound, cmfx.ErrNotFound())
	}
	return u, nil
}

// GetUserByUsername 根据账号名称查找用户对象
//
// NOTE: 用户名在数据表中不具备唯一性，只能保证非删除的数据是唯一的。
// 所以查找的数据不包含被标记为删除的数据。
func (m *Users) GetUserByUsername(username string) (*User, error) {
	sql := m.Module().DB().Where("username=? AND state<> ?", username, StateDeleted)
	u := &User{}
	if size, err := sql.Select(true, u); err != nil {
		return nil, err
	} else if size == 0 {
		return nil, nil
	} else {
		return u, nil
	}
}

// LeftJoin 将 [User.State] 以 LEFT JOIN 的形式插入到 sql 语句中
//
// alias 为 [User] 表的别名，on 为 LEFT JOIN 的条件。
func (m *Users) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string, states []State) {
	sql.Columns(alias+".state", alias+".no", alias+".created", alias+".last", alias+".username").
		Join("LEFT", m.mod.DB().TablePrefix()+(&User{}).TableName(), alias, on).
		AndIn(alias+".state", sliceutil.AnySlice(states)...)
}

func (m *Users) Module() *cmfx.Module { return m.mod }

// OnLogin 注册登录事件
func (m *Users) OnLogin(f func(*User)) context.CancelFunc { return m.loginEvent.Subscribe(f) }

// OnLogout 注册用户主动退出时的事
func (m *Users) OnLogout(f func(*User)) context.CancelFunc { return m.logoutEvent.Subscribe(f) }

// OnAdd 添加新用户时的事件
func (m *Users) OnAdd(f func(*User)) context.CancelFunc { return m.addEvent.Subscribe(f) }

// OnDelete 删除用户时的事件
func (m *Users) OnDelete(f func(*User)) context.CancelFunc { return m.addEvent.Subscribe(f) }

// Statistic 用户统计信息
type Statistic struct {
	Online int `orm:"name(online)" json:"online" yaml:"online" cbor:"online"` // 在线用户数，10 分钟之内登录的用户。
	Active int `orm:"name(active)" json:"active" yaml:"active" cbor:"active"` // 活跃用户数，一月之内登录的用户。
	All    int `orm:"name(all)" json:"all" yaml:"all" cbor:"all"`             // 所有用户数
	Month  int `orm:"name(month)" json:"month" yaml:"month" cbor:"month"`     // 本月新增用户数
	Week   int `orm:"name(week)" json:"week" yaml:"week" cbor:"week"`         // 本周新增用户数
	Day    int `orm:"name(day)" json:"day" yaml:"day" cbor:"day"`             // 今日新增用户数
}

// Statistic 统计用户信息
//
// now 为当前时间，用于往前推荐对应时间的各类数据。
func (m *Users) Statistic(now time.Time) (*Statistic, error) {
	online := now.Add(-10 * time.Minute)
	active := now.AddDate(0, 0, -30)
	month := now.AddDate(0, -1, 0)
	week := now.AddDate(0, 0, -7)
	day := now.AddDate(0, 0, -1)

	sql := m.mod.DB().SQLBuilder().Select().From(orm.TableName(&User{})).
		Count(`
		COUNT(CASE WHEN last > ? THEN id END) as online,
		COUNT(CASE WHEN last > ? THEN id END) as active,
		COUNT(CASE WHEN created > ? THEN id END) as month,
		COUNT(CASE WHEN created > ? THEN id END) as week,
		COUNT(CASE WHEN created > ? THEN id END) as day,
		COUNT(*) as {all}
		`, online, active, month, week, day)

	s := &Statistic{}
	if _, err := sql.QueryObject(true, s); err != nil {
		return nil, err
	}
	return s, nil
}
