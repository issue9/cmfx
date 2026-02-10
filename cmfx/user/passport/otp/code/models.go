// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

package code

import (
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/filters"
)

// 一个用户一条记录，有新记录就执行覆盖操作，
// 如果需要所有的验证码发送记录，需要使用者自己实现，比如短信发送记录，邮件的发送记录等。
type accountPO struct {
	// NOTE: 如果执行了删除操作，则物理删除记录。

	ID      int64     `orm:"name(id);ai"`
	Created time.Time `orm:"name(created)"`
	Target  string    `orm:"name(target);len(500);unique(target)"` // 接收者，手机号、邮箱等。
	UID     int64     `orm:"name(uid);unique(uid)"`                // 关联的 UID
}

func (l *accountPO) BeforeInsert() error {
	l.Created = time.Now()
	return nil
}

func (l *accountPO) TableName() string { return `` }

// 缓存系统中的验证码对象
type codePO struct {
	Code   string
	ReSend time.Time
}

type accountTO struct {
	Target string `json:"target" cbor:"target" yaml:"target" comment:"target"`
	Code   string `json:"code" cbor:"code" yaml:"code" comment:"code"`
}

func (a *accountTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("code", &a.Code)).
		Add(filters.NotEmpty("target", &a.Target))
}

type TargetTO struct {
	Target string `json:"target" yaml:"target" cbor:"target" comment:"code receiver, ignore when binded"`
}

func (a *TargetTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("target", &a.Target))
}
