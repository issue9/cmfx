// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

// Package passkey 提供 [webauthn]、windows hello、faceID 等的服务端
//
// [webauthn]: https://webauthn.io/
package passkey

import (
	nu "net/url"
	"time"

	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/openapi"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/user"
	"github.com/issue9/cmfx/cmfx/user/passport/utils"
)

type passkey struct {
	db    *orm.DB
	user  *user.Module
	id    string
	desc  web.LocaleStringer
	wa    *webauthn.WebAuthn
	cache web.Cache
	ttl   time.Duration
}

// Init 初始化 passkey 模块
//
// id 表示模块的 ID；
// ttl 表示 passkey 从 begin 到 finish 的有效时间；
// url 表示 webauthn 的 origins 参数，其中第一个元素的域名将作为 RPID 值；
func Init(u *user.Module, id string, desc web.LocaleStringer, ttl time.Duration, url ...string) user.Passport {
	s := u.Module().Server()

	uu, err := nu.Parse(url[0])
	if err != nil {
		panic(web.SprintError(u.Module().Server().Locale().Printer(), true, err))
	}

	wa, err := webauthn.New(&webauthn.Config{
		RPDisplayName: s.ID(),
		RPID:          uu.Hostname(),
		RPOrigins:     url,
	})
	if err != nil {
		panic(web.SprintError(u.Module().Server().Locale().Printer(), true, err))
	}

	p := &passkey{
		db:    utils.BuildDB(u.Module(), id),
		user:  u,
		id:    id,
		desc:  desc,
		wa:    wa,
		cache: web.NewCache(s.UniqueID(), s.Cache()),
		ttl:   ttl,
	}

	prefix := utils.BuildPrefix(u, id)
	rate := utils.BuildRate(u, id)

	u.Module().Router().Prefix(prefix, u, rate, cmfx.Unlimit(u.Module().Server())).
		Get("/register", p.registerBegin, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("psskey begin register for %s api", id), nil).
				Response200(protocol.CredentialCreation{})
		})).
		Post("/register", p.registerFinish, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("psskey register for %s api", id), nil).
				Body(protocol.CredentialCreationResponse{}, false, nil, nil).
				ResponseEmpty("201")
		})).
		Get("/credentials", p.getCredentials, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("passkey get credentials for %s api", id), nil).
				Response200([]credentialVO{})
		})).
		Delete("/credentials/{id}", p.delCredential, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("passkey delete credential for %s api", id), nil).
				Path("id", openapi.TypeString, web.Phrase("the id of credential"), nil).
				ResponseEmpty("204")
		})).
		Delete("", p.delPasskey, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("passkey delete for %s api", id), nil).
				ResponseEmpty("204")
		}))

	u.Module().Router().Prefix(prefix, rate, cmfx.Unlimit(u.Module().Server())).
		Get("/login/{username}", p.loginBegin, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("passkey begin login for %s api", id), nil).
				Response200(protocol.CredentialAssertion{}).
				Path("username", openapi.TypeString, web.Phrase("username"), nil)
		})).
		Post("/login/{username}", p.loginFinish, u.Module().API(func(o *openapi.Operation) {
			o.Tag("auth").Desc(web.Phrase("passkey login for %s api", id), nil).
				Body(protocol.CredentialAssertionResponse{}, false, nil, nil).
				ResponseEmpty("201")
		}))

	u.AddPassport(p)

	return p
}

func (p *passkey) ID() string { return p.id }

func (p *passkey) Description() web.LocaleStringer { return p.desc }

func (p *passkey) Delete(uid int64) error {
	_, err := p.db.Delete(&accountPO{UID: uid})
	return err
}

func (p *passkey) Identity(uid int64) (string, int8) {
	if u, err := p.user.GetUser(uid); err != nil {
		p.user.Module().Server().Logs().ERROR().Error(err)
		return "", -1
	} else {
		mod := &accountPO{UID: u.ID}
		if found, err := p.db.Select(mod); err != nil {
			p.user.Module().Server().Logs().ERROR().Error(err)
			return "", -1
		} else if !found {
			return "", -1
		}

		return u.Username, 0
	}
}
