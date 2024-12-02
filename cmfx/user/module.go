// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"net/http"

	"github.com/issue9/cache"
	"github.com/issue9/mux/v9/header"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
)

// Module 用户账号模块
type Module struct {
	mod         *cmfx.Module
	urlPrefix   string // 所有接口的 URL 前缀
	token       *tokens
	afterLogin  AfterFunc
	afterLogout AfterFunc

	passports []Passport
}

// Load 加载当前模块的环境
func Load(mod *cmfx.Module, conf *Config) *Module {
	store := token.NewCacheStore[*User](cache.Prefix(mod.Server().Cache(), mod.ID()))

	m := &Module{
		mod:         mod,
		urlPrefix:   conf.URLPrefix,
		token:       token.New(mod.Server(), store, conf.AccessExpired.Duration(), conf.RefreshExpired.Duration(), web.ProblemUnauthorized, nil),
		afterLogin:  conf.AfterLogin,
		afterLogout: conf.AfterLogout,
		passports:   make([]Passport, 0, 5),
	}

	mod.Router().Prefix(m.URLPrefix()).
		Get("/passports", m.getPassports, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("get passports list api"), nil).
				Response("200", []passportVO{}, nil, nil)
		}))

	mod.Router().Prefix(m.URLPrefix(), m).
		Delete("/token", m.logout, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("logout api"), nil).
				Header(header.ClearSiteData, openapi.TypeString, nil, nil).
				ResponseRef("204", "empty", nil, nil)
		})).
		Put("/token", m.refreshToken, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				Desc(web.Phrase("refresh token api"), nil).
				Response("204", &token.Response{}, nil, nil)
		})).
		Get("/securitylog", m.getSecyLogs, mod.API(func(o *openapi.Operation) {
			o.Tag("auth").
				QueryObject(queryLogTO{}, nil).
				Desc(web.Phrase("get login user security log api"), nil).
				Response("200", LogVO{}, nil, nil)
		}))

	initPassword(m)

	return m
}

func (m *Module) URLPrefix() string { return m.urlPrefix }

// GetUser 获取指定 uid 的用户
func (m *Module) GetUser(uid int64) (*User, error) {
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

// GetUserByUsername 根据账号名称查找用户对象
//
// NOTE: 用户名在数据表中不具备唯一性，只能保证非删除的数据是唯一的。
// 所以查找的数据不包含被标记为删除的数据。
func (m *Module) GetUserByUsername(username string) (*User, error) {
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
func (m *Module) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string, states []State) {
	sql.Columns(alias+".state", alias+".no", alias+".created").
		Join("LEFT", orm.TableName(&User{}), alias, on).
		AndIn(alias+".state", sliceutil.AnySlice(states)...)
}

func (m *Module) Module() *cmfx.Module { return m.mod }
