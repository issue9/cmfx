// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package user 会员账号
package user

import (
	"net/http"
	"os"

	"github.com/issue9/cache"
	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
	"github.com/issue9/webuse/v7/middlewares/auth/token"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user/passport"
)

// Loader 用户账号加载
type Loader struct {
	mod       *cmfx.Module
	urlPrefix string // 所有接口的 URL 前缀
	token     *tokens
	passport  *passport.Passport
}

// Load 加载当前模块的环境
func Load(mod *cmfx.Module, conf *Config) *Loader {
	store := token.NewCacheStore[*User](cache.Prefix(mod.Server().Cache(), mod.ID()))

	return &Loader{
		mod:       mod,
		urlPrefix: conf.URLPrefix,
		token:     token.New(mod.Server(), store, conf.accessExpired, conf.refreshExpired, web.ProblemUnauthorized, nil),
		passport:  passport.New(mod, conf.identityExpired),
	}
}

func (m *Loader) URLPrefix() string { return m.urlPrefix }

// GetUser 获取指定 uid 的用户
func (m *Loader) GetUser(uid int64) (*User, error) {
	u := &User{ID: uid}
	found, err := m.mod.DB().Select(u)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, web.NewError(http.StatusNotFound, os.ErrNotExist)
	}
	return u, nil
}

func (m *Loader) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string, states []State) {
	sql.Column(alias + ".state")
	sql.Join("left", orm.TableName(&User{}), alias, on).WhereStmt().AndIn(alias+".state", sliceutil.AnySlice(states)...)
}

func (m *Loader) Module() *cmfx.Module { return m.mod }
