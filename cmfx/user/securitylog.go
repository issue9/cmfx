// SPDX-FileCopyrightText: 2022-2025 caixw
//
// SPDX-License-Identifier: MIT

package user

import (
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/query"
)

// AddSecurityLog 添加一条记录
//
// tx 如果为空，表示由 AddSecurityLog 直接提交数据；
func (m *Users) AddSecurityLog(tx *orm.Tx, uid int64, ip, ua, content string) error {
	_, err := m.Module().Engine(tx).Insert(&logPO{
		UID:       uid,
		Content:   content,
		IP:        ip,
		UserAgent: ua,
	})
	return err
}

func (m *Users) AddSecurityLogFromContext(tx *orm.Tx, uid int64, ctx *web.Context, content web.LocaleStringer) error {
	return m.AddSecurityLog(tx, uid, ctx.ClientIP(), ctx.Request().UserAgent(), content.LocaleString(ctx.LocalePrinter()))
}

type queryLogTO struct {
	query.Text
	CreatedStart time.Time `query:"created.start"` // 创建日志的起始时间
	CreatedEnd   time.Time `query:"created.end"`   // 创建日志的结束时间
}

func (m *Users) getSecyLogs(ctx *web.Context) web.Responser {
	u := m.CurrentUser(ctx)
	return m.getSecurityLogs(u.ID, ctx)
}

// getSecurityLogs 将数据以固定的格式输出客户端
func (m *Users) getSecurityLogs(uid int64, ctx *web.Context) web.Responser {
	q := &queryLogTO{}
	if rslt := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); rslt != nil {
		return rslt
	}

	sql := m.mod.DB().SQLBuilder().Select().Columns("*").From(orm.TableName(&logPO{})).
		Desc("created").
		Where("uid=?", uid)
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.And("{user_agent} LIKE ? OR {ip} LIKE ? OR {content} LIKE ?", txt, txt, txt)
	}
	if !q.CreatedStart.IsZero() {
		sql.And("created>?", q.CreatedStart)
	}
	if !q.CreatedEnd.IsZero() {
		sql.And("{end}<?", q.CreatedEnd)
	}

	return query.PagingResponserWithConvert[logPO, LogVO](ctx, &q.Limit, sql, func(m *logPO) *LogVO {
		return &LogVO{
			Content:   m.Content,
			IP:        m.IP,
			UserAgent: m.UserAgent,
			Created:   m.Created,
		}
	})
}
