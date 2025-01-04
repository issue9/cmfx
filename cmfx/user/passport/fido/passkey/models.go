// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

import (
	"database/sql"
	"time"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/issue9/orm/v6/types"
)

type credentials = types.SliceOf[webauthn.Credential]

type accountPO struct {
	Username string `orm:"name(username);unique"`
	UID      int64  `orm:"name(uid);unique(uid)"`

	Requested   time.Time    `orm:"name(requested)"`       // 请求绑定的时间
	Binded      sql.NullTime `orm:"name(binded);nullable"` // 与用户绑定的时间
	Credentials credentials  `orm:"name(credentials)"`
}

func (p *accountPO) TableName() string { return `` }

func (p *accountPO) WebAuthnID() []byte { return []byte(p.Username) }

func (p *accountPO) WebAuthnName() string { return p.Username }

func (p *accountPO) WebAuthnDisplayName() string { return p.Username }

func (p *accountPO) WebAuthnCredentials() []webauthn.Credential {
	return []webauthn.Credential(p.Credentials)
}
