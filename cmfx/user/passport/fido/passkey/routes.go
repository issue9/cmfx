// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

import (
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func (p *passkey) registerBegin(ctx *web.Context) web.Responser {
	username, resp := ctx.PathString("username", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	uu, err := p.user.GetUserByUsername(username)
	if err != nil {
		return ctx.Error(nil, "")
	}
	if uu == nil {
		return ctx.NotFound()
	}

	account := &accountPO{UID: uu.ID}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		account = &accountPO{Username: username, UID: uu.ID, Requested: ctx.Begin()}
		if _, err := p.db.Insert(account); err != nil {
			return ctx.Error(err, "")
		}
	}

	opt, session, err := p.wa.BeginRegistration(account)
	if err != nil {
		return ctx.Error(err, "")
	}

	if err := p.cache.Set("reg-"+username, session, p.ttl); err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(opt)
}

func (p *passkey) registerFinish(ctx *web.Context) web.Responser {
	username, resp := ctx.PathString("username", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	account := &accountPO{Username: username}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	session := webauthn.SessionData{}
	if err := p.cache.Get("reg-"+username, &session); err != nil {
		return ctx.Error(err, "")
	}

	c, err := p.wa.FinishRegistration(account, session, ctx.Request())
	if err != nil {
		return ctx.Error(err, "")
	}
	account.Credentials = append(account.Credentials, *c)
	if _, err = p.db.Update(account); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

func (p *passkey) loginBegin(ctx *web.Context) web.Responser {
	username, resp := ctx.PathString("username", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	account := &accountPO{Username: username}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	opt, session, err := p.wa.BeginLogin(account)
	if err != nil {
		return ctx.Error(err, "")
	}

	if err := p.cache.Set("login-"+username, session, p.ttl); err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(opt)
}

func (p *passkey) loginFinish(ctx *web.Context) web.Responser {
	username, resp := ctx.PathString("username", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	account := &accountPO{Username: username}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	session := webauthn.SessionData{}
	if err := p.cache.Get("login-"+username, &session); err != nil {
		return ctx.Error(err, "")
	}

	_, err = p.wa.FinishLogin(account, session, ctx.Request())
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}
