// SPDX-License-Identifier: MIT

// Package securitylog 安全日志
package securitylog

import (
	"time"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
	"github.com/issue9/cmfx/pkg/query"
)

// SecurityLog 安全日志
//
// 安全日志是以用户类型为区分的日志对象，
// 用于记录用户的一些比较重要的操作记录。
type SecurityLog struct {
	db       *orm.DB
	dbPrefix orm.Prefix
}

type Log struct {
	// 展示数据不给 ID，自增 ID 会暴露一些不必要的信息。
	Content   string    `json:"content" xml:",cdata"`
	IP        string    `json:"ip" xml:"ip,attr"`
	UserAgent string    `json:"ua" xml:"ua"`
	Created   time.Time `xml:"created" json:"created"`
}

func New(mod string, db *orm.DB) *SecurityLog {
	return &SecurityLog{
		dbPrefix: orm.Prefix(mod),
		db:       db,
	}
}

// Add 添加一条记录
func (l *SecurityLog) Add(uid int64, ip, ua, content string) error {
	_, err := l.dbPrefix.DB(l.db).Insert(&log{
		UID:       uid,
		Content:   content,
		IP:        ip,
		UserAgent: ua,
	})
	return err
}

func (l *SecurityLog) AddWithContext(uid int64, ctx *web.Context, content string) error {
	return l.Add(uid, ctx.ClientIP(), ctx.Request().UserAgent(), content)
}

type logQuery struct {
	query.Text
	Created query.DateRange `query:"created"`
}

// GetHandle 将数据以固定的格式输出客户端
func (l *SecurityLog) GetHandle(uid int64, ctx *web.Context) web.Responser {
	q := &logQuery{}
	if rslt := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); rslt != nil {
		return rslt
	}

	sql := l.db.SQLBuilder().Select().Columns("*").From(l.dbPrefix.TableName(&log{})).
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

	return query.PagingResponser[Log](ctx, &q.Limit, sql, nil)
}
