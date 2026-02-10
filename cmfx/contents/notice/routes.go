// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"database/sql"
	"time"

	"github.com/issue9/conv"
	"github.com/issue9/orm/v6"
	"github.com/issue9/web"
	"github.com/issue9/web/filter"
	"github.com/issue9/web/openapi"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/locales"
	"github.com/issue9/cmfx/cmfx/query"
)

type noticeKind string

func (noticeKind) OpenAPISchema(s *openapi.Schema) {
	s.Type = openapi.TypeString
	s.Enum = []any{"all", "group", "users"}
}

type NoticeDetailTO struct {
	m *Notices

	Kind       noticeKind `json:"kind" yaml:"kind" cbor:"kind"`
	FilterName string     `json:"filter,omitempty" yaml:"filter,omitempty" cbor:"filter,omitempty"`
	Users      []int64    `json:"users,omitempty" yaml:"users,omitempty" cbor:"users,omitempty"`

	Expired sql.NullTime `json:"expired" yaml:"expired" cbor:"expired"`
	Type    int64        `json:"type" yaml:"type" cbor:"type"`

	Author  string `json:"author" yaml:"author" cbor:"author"`
	Title   string `json:"title" yaml:"title" cbor:"title"`
	Content string `json:"content" yaml:"content" cbor:"content"`
}

func (n *NoticeDetailTO) Filter(ctx *web.FilterContext) {
	typeRule := filter.V(func(v noticeKind) bool {
		return v == "all" || v == "group" || v == "users" || v == ""
	}, locales.InvalidValue)

	groupRule := filter.V(func(s string) (ok bool) {
		if s != "" {
			_, ok = n.m.filters[s]
			return ok
		}
		return true
	}, locales.InvalidValue)

	usersRule := filter.V(func(t []int64) bool {
		return n.Kind != "group" && len(t) > 0
	}, locales.InvalidValue)

	ctx.Add(filter.NewBuilder(typeRule)("type", &n.Kind)).
		Add(filter.NewBuilder(groupRule)("group", &n.FilterName)).
		Add(filter.NewBuilder(usersRule)("users", &n.Users))
}

// HandlePostNotices 创建通知
func (m *Notices) HandlePostNotices(ctx *web.Context, creator int64) web.Responser {
	to := &NoticeDetailTO{m: m}
	if resp := ctx.Read(true, to, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	po := &noticePO{
		NO:      m.user.Module().Server().UniqueID(),
		Created: ctx.Begin(),
		Creator: creator,
		Expired: to.Expired,
		All:     to.Kind == "all",
		Type:    to.Type,
		Author:  to.Author,
		Title:   to.Title,
		Content: to.Content,
	}

	var err error
	switch to.Kind {
	case "group":
		err = m.user.Module().DB().DoTransaction(func(tx *orm.Tx) error {
			id, err := tx.LastInsertID(po)
			if err != nil {
				return err
			}

			gs := make([]orm.TableNamer, 0, 100)
			for uid := range m.filters[to.FilterName].Users() {
				gs = append(gs, &groupPO{NID: id, UID: uid})
			}
			return tx.InsertMany(100, gs...)
		})
	case "users":
		err = m.user.Module().DB().DoTransaction(func(tx *orm.Tx) error {
			id, err := tx.LastInsertID(po)
			if err != nil {
				return err
			}

			gs := make([]orm.TableNamer, 0, 100)
			for _, uid := range to.Users {
				gs = append(gs, &groupPO{NID: id, UID: uid})
			}
			return tx.InsertMany(100, gs...)
		})
	case "all":
		_, err = m.user.Module().DB().Insert(po)
	}

	if err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// HandleGetFilters 获取所有注册的过滤器
func (m *Notices) HandleGetFilters(ctx *web.Context) web.Responser {
	p := ctx.LocalePrinter()

	filters := make(map[string]string, len(m.filters))
	for k, v := range m.filters {
		filters[k] = v.Desc().LocaleString(p)
	}
	return web.OK(filters)
}

type NoticeDetailQuery struct {
	query.Text
	Expired      bool      `query:"expired,false"` // 是否查询已过期的记录
	CreatedStart time.Time `query:"created-start"`
	CreatedEnd   time.Time `query:"created-end"`
	Creator      []int64   `query:"creator"`
	Type         []int64   `query:"type"`
}

// 通知的明细类型
type NoticeDetailVO struct {
	ID      int64        `json:"id" yaml:"id" cbor:"id"`
	Created time.Time    `json:"created" yaml:"created" cbor:"created"`
	Creator int64        `json:"creator" yaml:"creator" cbor:"creator"`
	Expired sql.NullTime `json:"expired" yaml:"expired" cbor:"expired"`
	Type    int64        `json:"type" yaml:"type" cbor:"type"`
	Author  string       `json:"author" yaml:"author" cbor:"author"`
	Title   string       `json:"title" yaml:"title" cbor:"title"`
	Content string       `json:"content" yaml:"content" cbor:"content"`
}

func newNoticeDetail(po *noticePO) *NoticeDetailVO {
	return &NoticeDetailVO{
		ID:      po.ID,
		Created: po.Created,
		Creator: po.Creator,
		Expired: po.Expired,
		Type:    po.Type,
		Author:  po.Author,
		Title:   po.Title,
		Content: po.Content,
	}
}

func (m *Notices) HandleGetNotices(ctx *web.Context) web.Responser {
	q := &NoticeDetailQuery{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.user.Module().DB().SQLBuilder().Select().
		From(orm.TableName(&noticePO{}))
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("title LIKE ? OR author LIKE ? OR content LIKE ?", txt, txt, txt)
	}
	if len(q.Type) > 0 {
		sql.AndIn("type", conv.MustSliceOf[any](q.Type)...)
	}
	if len(q.Creator) > 0 {
		sql.AndIn("creator", conv.MustSliceOf[any](q.Creator)...)
	}
	if q.Expired {
		sql.Where("expired>?", ctx.Begin())
	}
	if !q.CreatedStart.IsZero() {
		sql.Where("created>?", q.CreatedStart)
	}
	if !q.CreatedEnd.IsZero() {
		sql.Where("created<?", q.CreatedEnd)
	}

	return query.PagingResponserWithConvert(ctx, &q.Limit, sql, newNoticeDetail)
}

// idKey 表示路径中表示用户 ID 的参数名称
func (m *Notices) HandleGetNotice(ctx *web.Context, idKey string) web.Responser {
	notice, resp := m.getNoticeByIDKey(ctx, idKey)
	if resp != nil {
		return resp
	}
	return web.OK(newNoticeDetail(notice))
}

func (m *Notices) getNoticeByIDKey(ctx *web.Context, idKey string) (*noticePO, web.Responser) {
	id, resp := ctx.PathID(idKey, cmfx.NotFoundInvalidPath)
	if resp != nil {
		return nil, resp
	}

	notice := &noticePO{ID: id}
	found, err := m.user.Module().DB().Select(notice)
	if err != nil {
		return nil, ctx.Error(err, "")
	}
	if !found {
		return nil, ctx.NotFound()
	}

	return notice, nil
}

type NoticeQuery struct {
	query.Text
	CreatedStart time.Time `query:"created-start"`
	CreatedEnd   time.Time `query:"created-end"`
	Type         []int64   `query:"type"`
}

// 通知
type NoticeVO struct {
	NO      string       `json:"no" yaml:"no" cbor:"no"`
	Created time.Time    `json:"created" yaml:"created" cbor:"created"`
	Type    int64        `json:"type" yaml:"type" cbor:"type"`
	Author  string       `json:"author" yaml:"author" cbor:"author"`
	Title   string       `json:"title" yaml:"title" cbor:"title"`
	Content string       `json:"content" yaml:"content" cbor:"content"`
	Read    sql.NullTime `json:"read" yaml:"read" cbor:"read"`
}

func newNotice(po *noticePO) *NoticeVO {
	return &NoticeVO{
		NO:      po.NO,
		Created: po.Created,
		Type:    po.Type,
		Author:  po.Author,
		Title:   po.Title,
		Content: po.Content,
	}
}

// HandleGetUserNotices 获取当前用户的所有通知
func (m *Notices) HandleGetUserNotices(ctx *web.Context) web.Responser {
	type noticeR struct {
		noticePO
		Read sql.NullTime `orm:"name(read);nullable"`
	}

	q := &NoticeQuery{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.user.Module().DB().SQLBuilder().Select().
		Column("n.*").
		From(orm.TableName(&noticePO{}), "n")
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("n.title LIKE ? OR n.author LIKE ? OR n.content LIKE ?", txt, txt, txt)
	}
	if len(q.Type) > 0 {
		sql.AndIn("n.type", conv.MustSliceOf[any](q.Type)...)
	}
	if !q.CreatedStart.IsZero() {
		sql.Where("n.created>?", q.CreatedStart)
	}
	if !q.CreatedEnd.IsZero() {
		sql.Where("n.created<?", q.CreatedEnd)
	}

	sql.Join("LEFT", orm.TableName(&groupPO{}), "f", "f.nid=n.id").
		Where("f.uid=?", m.user.CurrentUser(ctx).ID).
		Column("f.read")

	return query.PagingResponserWithConvert(ctx, &q.Limit, sql, func(t *noticeR) *NoticeVO {
		r := newNotice(&t.noticePO)
		r.Read = t.Read
		return r
	})
}

// HandleGetUserNotice 获取当前用户的某条通知
//
// NOTE: 需要有用户牌登录状态
func (m *Notices) HandleGetUserNotice(ctx *web.Context, noKey string) web.Responser {
	n, g, resp := m.getUserNotice(ctx, noKey)
	if resp != nil {
		return resp
	}

	nn := newNotice(n)
	nn.Read = g.Read
	return web.OK(nn)
}

// HandlePostUserNoticeRead 让当前用户的某条通知状态改为已读
//
// NOTE: 需要有用户牌登录状态
func (m *Notices) HandlePostUserNoticeRead(ctx *web.Context, noKey string) web.Responser {
	_, g, resp := m.getUserNotice(ctx, noKey)
	if resp != nil {
		return resp
	}
	g.Read = sql.NullTime{Time: ctx.Begin(), Valid: true}
	if _, err := m.user.Module().DB().Update(g, "read"); err != nil {
		return ctx.Error(err, "")
	}
	return web.Created(nil, "")
}

// HandleDeleteUserNoticeRead 让当前用户的某条通知状态改为未读
//
// NOTE: 需要有用户牌登录状态
func (m *Notices) HandleDeleteUserNoticeRead(ctx *web.Context, noKey string) web.Responser {
	_, g, resp := m.getUserNotice(ctx, noKey)
	if resp != nil {
		return resp
	}
	g.Read = sql.NullTime{}
	if _, err := m.user.Module().DB().Update(g, "read"); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

// NOTE: 需要有用户牌登录状态
func (m *Notices) getUserNotice(ctx *web.Context, noKey string) (*noticePO, *groupPO, web.Responser) {
	no, resp := ctx.PathString(noKey, cmfx.NotFoundInvalidPath)
	if resp != nil {
		return nil, nil, resp
	}

	n := &noticePO{NO: no}
	found, err := m.user.Module().DB().Select(n)
	if err != nil {
		return nil, nil, ctx.Error(err, "")
	}
	if !found {
		return nil, nil, ctx.NotFound()
	}

	u := m.user.CurrentUser(ctx)
	g := &groupPO{UID: u.ID, NID: n.ID}
	found, err = m.user.Module().DB().Select(g)
	if err != nil {
		return nil, nil, ctx.Error(err, "")
	}
	if !found {
		if n.All { // 需要创建记录，用于保存是否已读的信息
			g = &groupPO{UID: u.ID, NID: n.ID}
			if _, err := m.user.Module().DB().Insert(g); err != nil {
				return nil, nil, ctx.Error(err, "")
			}
		} else {
			return nil, nil, ctx.NotFound()
		}
	}

	return n, g, nil
}
