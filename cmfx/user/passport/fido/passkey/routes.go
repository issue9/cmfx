// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

import (
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func (p *passkey) deletePasskey(ctx *web.Context) web.Responser {
	uu := p.user.CurrentUser(ctx)

	if _, err := p.db.Delete(&accountPO{UID: uu.ID}); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

func (p *passkey) registerBegin(ctx *web.Context) web.Responser {
	uu := p.user.CurrentUser(ctx)
	if uu == nil {
		return ctx.NotFound()
	}

	account := &accountPO{UID: uu.ID}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		account = &accountPO{Username: uu.Username, UID: uu.ID, Requested: ctx.Begin()}
		if _, err := p.db.Insert(account); err != nil {
			return ctx.Error(err, "")
		}
	}

	opt, session, err := p.wa.BeginRegistration(account)
	if err != nil {
		return ctx.Error(err, "")
	}

	if err := p.cache.Set("reg-"+uu.Username, session, p.ttl); err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(opt)
}

func (p *passkey) registerFinish(ctx *web.Context) web.Responser {
	u := p.user.CurrentUser(ctx)
	if u == nil {
		return ctx.NotFound()
	}

	account := &accountPO{UID: u.ID}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	session := webauthn.SessionData{}
	if err := p.cache.Get("reg-"+u.Username, &session); err != nil {
		return ctx.Error(err, "")
	}

	c, err := p.wa.FinishRegistration(account, session, ctx.Request())
	if err != nil {
		return ctx.Error(err, "")
	}
	if _, err = p.db.Update(&accountPO{UID: u.ID, Credentials: append(account.Credentials, *c)}); err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

func (p *passkey) loginBegin(ctx *web.Context) web.Responser {
	username, resp := ctx.PathString("username", cmfx.UnauthorizedInvalidAccount)
	if resp != nil {
		return resp
	}

	account := &accountPO{Username: username}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
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
	username, resp := ctx.PathString("username", cmfx.UnauthorizedInvalidAccount)
	if resp != nil {
		return resp
	}

	account := &accountPO{Username: username}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.Problem(cmfx.UnauthorizedInvalidAccount)
	}

	session := webauthn.SessionData{}
	if err := p.cache.Get("login-"+username, &session); err != nil {
		return ctx.Error(err, "")
	}

	if _, err = p.wa.FinishLogin(account, session, ctx.Request()); err != nil {
		return ctx.Error(err, "")
	}

	if err = p.cache.Delete("login-" + username); err != nil {
		ctx.Logs().ERROR().Error(err) // 只记录错误，不退出。
	}

	u, err := p.user.GetUser(account.UID)
	if err != nil {
		return ctx.Error(err, "")
	}

	return p.user.CreateToken(ctx, u, p)
}
