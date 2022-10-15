// SPDX-License-Identifier: MIT

package oauth

import (
	"html"
	"time"
)

type modelOAuth struct {
	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`
	Updated time.Time `orm:"name(updated)"`

	UID      int64  `orm:"name(uid);unique(uid)"`
	Identity string `orm:"name(identity);len(32);unique(identity)"`
}

func (p *modelOAuth) TableName() string { return `_oauth` }

func (p *modelOAuth) BeforeInsert() error {
	p.Created = time.Now()
	p.Identity = html.EscapeString(p.Identity)
	return nil
}

func (p *modelOAuth) BeforeUpdate() error {
	p.Updated = time.Now()
	p.Identity = html.EscapeString(p.Identity)
	return nil
}
