// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"net/http"

	"github.com/issue9/cache"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

// Module 用户账号模块
type Module struct {
	mod       *cmfx.Module
	urlPrefix string // 所有接口的 URL 前缀
	token     *tokens
	passport  *passport.Passport
}

// Load 加载当前模块的环境
func Load(mod *cmfx.Module, conf *Config) *Module {
	store := token.NewCacheStore[*User](cache.Prefix(mod.Server().Cache(), mod.ID()))

	return &Module{
		mod:       mod,
		urlPrefix: conf.URLPrefix,
		token:     token.New(mod.Server(), store, conf.AccessExpired.Duration(), conf.RefreshExpired.Duration(), web.ProblemUnauthorized, nil),
		passport:  passport.New(mod),
	}
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

// LeftJoin 将 [User.State] 以 LEFT JOIN 的形式插入到 sql 语句中
//
// alias 为 [User] 表的别名，on 为 LEFT JOIN 的条件。
func (m *Module) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string, states []State) {
	sql.Columns(alias+".state", alias+".no", alias+".created").
		Join("LEFT", orm.TableName(&User{}), alias, on).
		AndIn(alias+".state", sliceutil.AnySlice(states)...)
}

func (m *Module) Module() *cmfx.Module { return m.mod }
