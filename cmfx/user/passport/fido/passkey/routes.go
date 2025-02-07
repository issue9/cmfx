// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"slices"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
)

func (p *passkey) delPasskey(ctx *web.Context) web.Responser {
	uu := p.user.CurrentUser(ctx)

	if _, err := p.db.Delete(&accountPO{UID: uu.ID}); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

func (p *passkey) delCredential(ctx *web.Context) web.Responser {
	id, resp := ctx.PathString("id", cmfx.NotFoundInvalidPath)
	if resp != nil {
		return resp
	}

	uu := p.user.CurrentUser(ctx)
	account := &accountPO{UID: uu.ID}
	found, err := p.db.Select(account)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found {
		return ctx.NotFound()
	}

	account.Credentials = slices.DeleteFunc(account.Credentials, func(e credentialPO) bool {
		nid, err := base64.URLEncoding.DecodeString(id)
		fmt.Println(id, nid, err, e.Credential.ID)
		return bytes.Equal(e.Credential.ID, nid)
	})

	if len(account.Credentials) == 0 {
		if _, err := p.db.Delete(&accountPO{UID: uu.ID}); err != nil {
			return ctx.Error(err, "")
		}
	} else if _, err := p.db.Update(&accountPO{UID: uu.ID, Credentials: account.Credentials}); err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

func (p *passkey) getCredentials(ctx *web.Context) web.Responser {
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

	credentials := make([]*credentialVO, 0, len(account.Credentials))
	for _, c := range account.Credentials {
		credentials = append(credentials, &credentialVO{
			Created: c.Created,
			Last:    c.Last,
			ID:      c.Credential.ID,
			UA:      c.UA,
		})
	}
	return web.OK(credentials)
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
	cs := append(account.Credentials, credentialPO{
		Created:    ctx.Begin(),
		Last:       ctx.Begin(),
		UA:         ctx.Request().UserAgent(),
		Credential: *c,
	})
	if _, err = p.db.Update(&accountPO{UID: u.ID, Credentials: cs}); err != nil {
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
		return ctx.Error(err, cmfx.UnauthorizedInvalidAccount)
	}

	c, err := p.wa.FinishLogin(account, session, ctx.Request())
	if err != nil {
		return ctx.Error(err, cmfx.UnauthorizedInvalidAccount)
	}

	// 更新证书末次使用时间
	index := slices.IndexFunc(account.Credentials, func(item credentialPO) bool { return bytes.Equal(item.Credential.ID, c.ID) })
	if index >= 0 {
		account.Credentials[index].Last = ctx.Begin()
	}
	if _, err := p.db.Update(&accountPO{UID: account.UID, Credentials: account.Credentials}); err != nil {
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
