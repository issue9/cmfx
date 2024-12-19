// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"errors"
	"time"

	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/web/openapi"
	"github.com/issue9/webuse/v7/middlewares/acl/ratelimit"
	"github.com/issue9/webuse/v7/middlewares/auth/token"
	"golang.org/x/crypto/bcrypt"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
)

const (
	defaultCost  = bcrypt.DefaultCost
	passwordMode = "password"
)

type password struct {
	mod *Module
}

type accountTO struct {
	XMLName  struct{} `xml:"account" json:"-" cbor:"-" yaml:"-"`
	Username string   `json:"username" xml:"username" cbor:"username" yaml:"username" comment:"username"`
	Password string   `json:"password" xml:"password" cbor:"password" yaml:"password" comment:"passport"`
}

func (c *accountTO) Filter(v *web.FilterContext) {
	v.Add(filters.NotEmpty("username", &c.Username)).
		Add(filters.NotEmpty("password", &c.Password))
}

func initPassword(mod *Module) {
	p := &password{mod: mod}
	router := mod.Module().Router().Prefix(mod.URLPrefix() + "/passports/" + passwordMode)

	rate := ratelimit.New(web.NewCache(mod.Module().ID()+"passports_"+passwordMode+"_rate", mod.Module().Server().Cache()), 20, time.Second, nil)
	router.Post("/login", p.postLogin, rate, cmfx.Unlimit(mod.Module().Server()), mod.Module().API(func(o *openapi.Operation) {
		o.Tag("auth").
			Desc(web.Phrase("login by %s api", passwordMode), nil).
			Body(&accountTO{}, false, nil, nil).
			Response("201", token.Response{}, nil, nil)
	}))

	router.Put("", p.putPassword, p.mod, p.mod.Module().API(func(o *openapi.Operation) {
		o.Tag("auth").
			Desc(web.Phrase("change current user password for %s passport api", passwordMode), nil).
			Body(&passwordTO{}, false, nil, nil).
			ResponseEmpty("204")
	}))

	mod.AddPassport(p)
}

func (p *password) postLogin(ctx *web.Context) web.Responser {
	data := &accountTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidHeader); resp != nil {
		return resp
	}

	mod := &User{}
	n, err := p.mod.mod.DB().Where("username=?", data.Username).Select(true, mod)
	if err != nil {
		return ctx.Error(err, "")
	}
	if n <= 0 {
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	}

	// 如果密码是空值，则不能通过此方法登录
	if bcrypt.CompareHashAndPassword(mod.Password, []byte{}) == nil {
		return ctx.Problem(cmfx.UnauthorizedNeedChangePassword)
	}

	err = bcrypt.CompareHashAndPassword(mod.Password, []byte(data.Password))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	case err != nil:
		return ctx.Error(err, "")
	default:
		mod.Password = nil
		return p.mod.CreateToken(ctx, mod, p)
	}
}

type passwordTO struct {
	XMLName struct{} `xml:"password" json:"-" yaml:"-" cbor:"-"`
	New     string   `json:"new" yaml:"new" cbor:"new" comment:"new password"`
	Old     string   `json:"old" yaml:"old" cbor:"old" comment:"old password"`
}

func (a *passwordTO) Filter(ctx *web.FilterContext) {
	b := filter.NewBuilder(filter.V(
		func(t string) bool { return t != a.Old },
		web.Phrase("the new password can not be equal old"),
	))

	ctx.Add(filters.NotEmpty("new", &a.New)).
		Add(filters.NotEmpty("old", &a.Old)).
		Add(b("new", &a.New))
}

func (p *password) putPassword(ctx *web.Context) web.Responser {
	data := &passwordTO{}
	if resp := ctx.Read(true, data, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	mod := &User{ID: p.mod.CurrentUser(ctx).ID}

	if found, err := p.mod.mod.DB().Select(mod); err != nil {
		return ctx.Error(err, "")
	} else if !found {
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	}

	err := bcrypt.CompareHashAndPassword(mod.Password, []byte(data.Old))
	switch {
	case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	case err != nil:
		return ctx.Error(err, "")
	}

	pa, err := bcrypt.GenerateFromPassword([]byte(data.New), defaultCost)
	if err != nil {
		return ctx.Error(err, "")
	}
	_, err = p.mod.mod.DB().Update(&User{
		ID:       mod.ID,
		Password: pa,
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

func (p *password) ID() string { return passwordMode }

func (p *password) Description() web.LocaleStringer { return web.Phrase("passport password mode") }

// Delete 删除关联的密码信息
func (p *password) Delete(int64) error { return nil }

func (p *password) Identity(uid int64) string {
	mod := &User{ID: uid}
	found, err := p.mod.mod.DB().Select(mod)
	if err != nil {
		p.mod.Module().Server().Logs().ERROR().Error(err)
		return ""
	}
	if !found {
		return ""
	}

	return mod.Username
}

// UsernameValidator 账号名的验证器
func UsernameValidator(id string) bool {
	if id == "" || isDigit(rune(id[0])) {
		return false
	}

	for _, r := range id {
		if !isAlpha(r) && !isDigit(r) && r != '_' && r != '-' {
			return false
		}
	}

	return true
}

func isAlpha(r rune) bool { return r >= 'A' && r <= 'Z' || r >= 'a' && r <= 'z' }

func isDigit(r rune) bool { return r >= '0' && r <= '9' }
