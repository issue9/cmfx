// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package custom

import (
	"html"
	"time"
)

type modelCustom struct {
	ID       int64     `orm:"name(id);ai"`
	Created  time.Time `orm:"name(created)"`
	UID      int64     `orm:"name(uid);unique(uid)"`
	Identity string    `orm:"name(identity);len(32);unique(identity)"`
}

func (p *modelCustom) TableName() string { return `` } // 自定义功能，表名由功能方自定义。

func (p *modelCustom) BeforeInsert() error {
	p.Created = time.Now()
	p.Identity = html.EscapeString(p.Identity)
	return nil
}

func (p *modelCustom) BeforeUpdate() error {
	p.Identity = html.EscapeString(p.Identity)
	return nil
}
