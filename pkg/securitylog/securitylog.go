// SPDX-License-Identifier: MIT

// Package securitylog 安全日志
package securitylog

import (
	"time"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
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
	Content   string    `json:"content" yaml:"content" xml:",cdata"`
	IP        string    `json:"ip" yaml:"ip" xml:"ip,attr"`
	UserAgent string    `json:"ua" yaml:"ua" xml:"ua"`
	Created   time.Time `xml:"created" yaml:"created" json:"created"`
}

type Logs struct {
	Count int64  `json:"count" yaml:"count" xml:"count,attr"`
	Logs  []*Log `json:"logs" yaml:"logs" xml:"log"`
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

// Get 获取与 uid 关联的安全日志信息
func (l *SecurityLog) Get(uid int64, size, page int, txt string, start, end time.Time) (*Logs, error) {
	sql := l.db.SQLBuilder().Select().Columns("*").From(l.dbPrefix.TableName(&log{})).
		Limit(size, page*size).
		Desc("created").
		Where("uid=?", uid)
	if txt != "" {
		txt = "%" + txt + "%"
		sql.And("{user_agent} LIKE OR {ip} LIKE ? OR {content} LIKE ?", txt, txt, txt)
	}
	if !start.IsZero() {
		sql.And("created>?", start)
	}
	if !end.IsZero() {
		sql.And("{end}<?", end)
	}

	count, err := sql.Count("count(*) as cnt").QueryInt("cnt")
	if err != nil {
		return nil, err
	}
	sql.Count("")

	ls := make([]*log, 0, size)
	if _, err := sql.QueryObject(true, &ls); err != nil {
		return nil, err
	}

	logs := make([]*Log, 0, len(ls))
	for _, ll := range ls {
		logs = append(logs, &Log{
			Content:   ll.Content,
			IP:        ll.IP,
			Created:   ll.Created,
			UserAgent: ll.UserAgent,
		})
	}
	return &Logs{Count: count, Logs: logs}, nil
}

type query struct {
	cmfx.Text
	Created cmfx.DateRange `query:"created"`
}

// GetHandle 将数据以固定的格式输出客户端
func (l *SecurityLog) GetHandle(uid int64, ctx *web.Context) web.Responser {
	q := &query{}
	if rslt := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); rslt != nil {
		return rslt
	}

	logs, err := l.Get(uid, q.Size, q.Page, q.Text.Text, q.Created.Start, q.Created.End)
	if err != nil {
		return ctx.InternalServerError(err)
	}
	if len(logs.Logs) == 0 {
		return ctx.NotFound()
	}
	return web.OK(logs)
}
