// SPDX-License-Identifier: MIT

// Package user 会员账号
package user

import (
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/issue9/cmfx"
	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
	"github.com/issue9/web/server"

	"github.com/issue9/cmfx/pkg/authenticator"
	"github.com/issue9/cmfx/pkg/user/token"
)

// Module 用户账号管理模块
//
// 提供了登录验证和 token 管理
type Module struct {
	mod       cmfx.Module
	urlPrefix string // 所有接口的 URL 前缀
	token     *token.Tokens
	auth      *authenticator.Authenticators
}

func NewModule(mod cmfx.Module, conf *Config) (*Module, error) {
	desc := web.Phrase("recycle token for %s", mod.Desc())
	tks, err := token.NewTokens(mod, conf.AccessExpires, conf.RefreshExpires, desc)
	if err != nil {
		return nil, web.NewStackError(err)
	}

	for index, alg := range conf.Algorithms {
		tks.Add(strconv.Itoa(index), alg.sign, alg.pub, alg.pvt)
	}

	const authDesc = web.StringPhrase("recycle auth id")
	m := &Module{
		mod:       mod,
		urlPrefix: conf.URLPrefix,
		token:     tks,
		auth:      authenticator.NewAuthenticators(mod.Server(), time.Minute*2, authDesc),
	}
	return m, nil
}

func (m *Module) URLPrefix() string { return m.urlPrefix }

// Router 声明以 [Module.URLPrefix] 为前缀的路径
func (m *Module) Router(r *web.Router, ms ...web.Middleware) *server.Prefix {
	return r.Prefix(m.URLPrefix(), ms...)
}

func (m *Module) GetUser(uid int64) (*User, error) {
	u := &User{ID: uid}
	found, err := m.DBEngine(nil).Select(u)
	if err != nil {
		return nil, err
	}
	if !found {
		return nil, web.NewHTTPError(http.StatusNotFound, os.ErrNotExist)
	}
	return u, nil
}

func (m *Module) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string, states []State) {
	sql.Column(alias + ".state")
	sql.Join("left", m.mod.DBPrefix().TableName(&User{}), alias, on).WhereStmt().AndIn(alias+".state", sliceutil.AnySlice(states)...)
}

// 实现 cmfx.Module

func (m *Module) ID() string                                         { return m.mod.ID() }
func (m *Module) Desc() web.LocaleStringer                           { return m.mod.Desc() }
func (m *Module) Server() *web.Server                                { return m.mod.Server() }
func (m *Module) DB() *orm.DB                                        { return m.mod.DB() }
func (m *Module) DBPrefix() orm.Prefix                               { return m.mod.DBPrefix() }
func (m *Module) DBEngine(tx *orm.Tx) orm.ModelEngine                { return m.mod.DBEngine(tx) }
func (m *Module) Cache() web.Cache                                   { return m.mod.Cache() }
func (m *Module) New(id string, desc web.LocaleStringer) cmfx.Module { return m.mod.New(id, desc) }
