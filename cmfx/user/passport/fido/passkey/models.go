// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package passkey

import (
	"time"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/issue9/orm/v6/types"
)

type credentials = types.SliceOf[credentialPO]

type accountPO struct {
	Username    string      `orm:"name(username);unique(username)"`
	UID         int64       `orm:"name(uid);unique(uid)"`
	Requested   time.Time   `orm:"name(requested)"` // 请求绑定的时间
	Credentials credentials `orm:"name(credentials)"`
}

func (p *accountPO) TableName() string { return `` }

func (p *accountPO) WebAuthnID() []byte { return []byte(p.Username) }

func (p *accountPO) WebAuthnName() string { return p.Username }

func (p *accountPO) WebAuthnDisplayName() string { return p.Username }

func (p *accountPO) WebAuthnCredentials() []webauthn.Credential {
	cs := make([]webauthn.Credential, 0, len(p.Credentials))
	for _, c := range p.Credentials {
		cs = append(cs, c.Credential)
	}
	return cs
}

type credentialPO struct {
	Created    time.Time           `json:"created"`
	Last       time.Time           `json:"last"`
	UA         string              `json:"ua"`
	Credential webauthn.Credential `json:"credential"`
}

type credentialVO struct {
	XMLName struct{}  `xml:"credential" json:"-" yaml:"-" cbor:"-"`
	Created time.Time `json:"created" yaml:"created" cbor:"created" xml:"created"`
	Last    time.Time `json:"last" yaml:"last" cbor:"last" xml:"last"`
	ID      []byte    `json:"id" yaml:"id" cbor:"id" xml:"id"`
	UA      string    `json:"ua" yaml:"ua" cbor:"ua" xml:"ua"`
}
