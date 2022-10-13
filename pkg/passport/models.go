// SPDX-License-Identifier: MIT

package passport

import (
	"html"
	"time"
)

type code struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`
	Updated time.Time `orm:"name(updated)"`

	UID      int64  `orm:"name(uid);index(uid)"`
	Username string `orm:"name(username);len(32);index(username)"`
	Type     string `orm:"name(type);len(20)"`
}

type password struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`
	Updated time.Time `orm:"name(updated)"`

	UID      int64  `orm:"name(uid);index(uid)"`
	Username string `orm:"name(username);len(32);index(username)"`
	Password []byte `orm:"name(password);len(64)"`
	Type     string `orm:"name(type);len(20)"`
}

type oauth struct {
	UID         int64  `orm:"name(uid);index(uid)"`
	OAuthID     string `orm:"name(oauth_id);len(32);index(oauth_id)"`
	AccessToken string `orm:"name(access_token);len(64)"`
	Expires     int64  `orm:"name(expires)"`
	Vendor      string `orm:"name(vendor);len(20)"` // oauth 提供方
}

func (p *code) TableName() string { return `_passport_codes` }

func (p *code) BeforeInsert() error {
	p.Created = time.Now()
	p.Username = html.EscapeString(p.Username)
	return nil
}

func (p *code) BeforeUpdate() error {
	p.Updated = time.Now()
	p.Username = html.EscapeString(p.Username)
	return nil
}

func (p *password) TableName() string { return `_passport_passwords` }

func (p *password) BeforeInsert() error {
	p.Created = time.Now()
	p.Username = html.EscapeString(p.Username)
	return nil
}

func (p *password) BeforeUpdate() error {
	p.Updated = time.Now()
	p.Username = html.EscapeString(p.Username)
	return nil
}

func (o *oauth) TableName() string { return `_passport_oauths` }
