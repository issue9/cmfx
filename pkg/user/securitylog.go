// SPDX-License-Identifier: MIT

package user

import (
	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/query"
)

// AddSecurityLog 添加一条记录
//
// tx 如果为空，表示由 AddSecurityLog 直接提交数据；
func (m *Module) AddSecurityLog(tx *orm.Tx, uid int64, ip, ua, content string) error {
	_, err := m.DBEngine(tx).Insert(&log{
		UID:       uid,
		Content:   content,
		IP:        ip,
		UserAgent: ua,
	})
	return err
}

func (m *Module) AddSecurityLogFromContext(tx *orm.Tx, uid int64, ctx *web.Context, content string) error {
	return m.AddSecurityLog(tx, uid, ctx.ClientIP(), ctx.Request().UserAgent(), content)
}

type logQuery struct {
	query.Text
	Created query.DateRange `query:"created"`
}

// GetSecurityLogs 将数据以固定的格式输出客户端
func (m *Module) GetSecurityLogs(uid int64, ctx *web.Context) web.Responser {
	u := m.LoginUser(ctx)
	return m.getSecurityLogs(u.ID, ctx)
}

// getSecurityLogs 将数据以固定的格式输出客户端
func (m *Module) getSecurityLogs(uid int64, ctx *web.Context) web.Responser {
	q := &logQuery{}
	if rslt := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); rslt != nil {
		return rslt
	}

	sql := m.db.SQLBuilder().Select().Columns("*").From(m.dbPrefix.TableName(&log{})).
		Desc("created").
		Where("uid=?", uid)
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.And("{user_agent} LIKE OR {ip} LIKE ? OR {content} LIKE ?", txt, txt, txt)
	}
	if !q.Created.Start.IsZero() {
		sql.And("created>?", q.Created.Start)
	}
	if !q.Created.End.IsZero() {
		sql.And("{end}<?", q.Created.End)
	}

	return query.PagingResponser[respLog](ctx, &q.Limit, sql, nil)
}
