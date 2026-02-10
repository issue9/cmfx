// SPDX-FileCopyrightText: 2022-2026 caixw
//
// SPDX-License-Identifier: MIT

package totp

import (
	"database/sql"
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/filters"
)

// 已开通 TOTP 的账号
type accountPO struct {
	ID        int64        `orm:"name(id);ai"`
	Requested time.Time    `orm:"name(requested)"`       // 请求绑定的时间
	Binded    sql.NullTime `orm:"name(binded);nullable"` // 与用户绑定的时间
	UID       int64        `orm:"name(uid);unique(uid)"`
	Secret    string       `orm:"name(secret);len(32)"`
}

func (p *accountPO) TableName() string { return `` }

type accountTO struct {
	Username string `json:"username" cbor:"username" yaml:"username" comment:"username"`
	Code     string `json:"code" cbor:"code" yaml:"code" comment:"totp code"`
}

func (t *accountTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("code", &t.Code)).
		Add(filters.NotEmpty("username", &t.Username))
}

type codeTO struct {
	Code string `json:"code" cbor:"code" yaml:"code" comment:"totp code"`
}

func (t *codeTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("code", &t.Code))
}

type secretVO struct {
	Username string `json:"username" yaml:"username" cbor:"username" comment:"username"`
	Secret   string `json:"secret" yaml:"secret" cbor:"secret" comment:"totp secret"`
	Expired  int    `json:"expired" yaml:"expired" cbor:"expired" comment:"expired in seconds"`
}
