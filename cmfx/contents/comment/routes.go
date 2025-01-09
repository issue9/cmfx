// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package comment

import (
	"database/sql"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/query"
)

// CommentVO 摘要信息
type CommentVO struct {
	XMLName  struct{}  `xml:"comment" json:"-" yaml:"-" cbor:"-" orm:"-"`
	ID       int64     `xml:"id" json:"id" yaml:"id" cbor:"id" orm:"name(id)"`
	Author   string    `xml:"author" json:"author" yaml:"author" cbor:"author" orm:"name(author)"`
	Created  time.Time `xml:"created" json:"created" yaml:"created" cbor:"created" orm:"name(created)"`
	Modified time.Time `xml:"modified" json:"modified" yaml:"modified" cbor:"modified" orm:"name(modified)"`
	Content  string    `xml:"content" json:"content" yaml:"content" cbor:"content" orm:"name(content)"`
	Rate     int       `xml:"rate" json:"rate" yaml:"rate" cbor:"rate" orm:"name(rate)"`
}

type CommentQuery struct {
	m *Module
	query.Text
	Created time.Time `query:"created"`
}

func (q *CommentQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
}

// HandleSetState 设置状态
func (m *Module) HandleSetState(ctx *web.Context, comment int64, s State, status int) web.Responser {
	po := &commentPO{ID: comment}
	if _, err := m.db.Select(po); err != nil {
		return ctx.Error(err, "")
	}

	if _, err := m.db.Update(&commentPO{ID: comment, State: s}, "state"); err != nil {
		return ctx.Error(err, "")
	}
	return web.Status(status)
}

// HandleGetComments 获取评论列表
//
// 查询参数为 [CommentQuery]，返回对象为 [query.Page[CommentVO]]
func (m *Module) HandleGetComments(ctx *web.Context) web.Responser {
	q := &CommentQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&commentPO{}), "c").
		Column("c.id,c.created,c.modified,s.rate,s.content").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "c.last=s.id").
		AndIsNull("c.deleted").
		Desc("c.{created}")
	if !q.Created.IsZero() {
		sql.Where("c.created>?", q.Created)
	}
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("s.content ? OR c.author LIKE ?", txt, txt)
	}

	return query.PagingResponser[CommentVO](ctx, &q.Limit, sql, nil)
}

// HandleGetCommentsByTarget 获取指定对象的评论列表
//
// 查询参数为 [CommentQuery]，返回对象为 [query.Page[CommentVO]]
func (m *Module) HandleGetCommentsByTarget(ctx *web.Context, target int64) web.Responser {
	q := &CommentQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&commentPO{}), "c").
		Column("c.id,c.created,c.modified,s.rate,s.content").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "c.last=s.id").
		Where("target=?", target).
		AndIsNull("c.deleted").
		Desc("c.{created}")
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("s.content LIKE ? OR c.author LIKE ?", txt, txt)
	}
	if !q.Created.IsZero() {
		sql.Where("c.created>?", q.Created)
	}

	return query.PagingResponser[CommentVO](ctx, &q.Limit, sql, nil)
}

// HandleGetComment 获取评论信息
//
// 返回参数的实际类型为 [CommentVO]；
// comment 为评论的 ID，使用都需要确保值的正确性；
func (m *Module) HandleGetComment(ctx *web.Context, comment int64) web.Responser {
	a := &CommentVO{}
	size, err := m.db.SQLBuilder().Select().From(orm.TableName(&commentPO{}), "c").
		Column("c.id,c.created,c.modified,s.rate,s.content,c.author").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "c.last=s.id").
		Where("c.id=?", comment).
		AndIsNull("c.deleted").
		QueryObject(true, a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if size == 0 {
		return ctx.NotFound()
	}

	return web.OK(a)
}

type CommentTO struct {
	m *Module

	XMLName struct{} `xml:"comment" json:"-" yaml:"-" cbor:"-"`
	Content string   `json:"content" yaml:"content" cbor:"content" xml:"content"`
	Rate    int      `json:"rate" yaml:"rate" cbor:"rate" xml:"rate,attr"`
	Author  string   `json:"author" yaml:"author" cbor:"author" xml:"author"` // 显示的作者信息
	Parent  int64    `json:"parent" yaml:"parent" cbor:"parent" xml:"parent"` // 父评论
}

func (to *CommentTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("content", &to.Content)).
		Add(filters.BetweenEqual(0, 10)("rate", &to.Rate)).
		Add(filters.NotEmpty("author", &to.Author))
}

// HandlePostComment 添加新的评论
//
// creator 为创建者的 ID，调用者需要确保值的正确性；target 为评论对象的 ID；
// 提交类型为 [CommentTO]；
func (m *Module) HandlePostComment(ctx *web.Context, creator, target int64) web.Responser {
	a := &CommentTO{m: m}
	if resp := ctx.Read(true, a, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	err := m.db.DoTransactionTx(ctx, nil, func(tx *orm.Tx) error {
		comment, err := tx.LastInsertID(&commentPO{ // 添加评论
			Author:   a.Author,
			Parent:   a.Parent,
			Created:  ctx.Begin(),
			Creator:  creator,
			Modified: ctx.Begin(),
			Target:   target,
		})
		if err != nil {
			return err
		}

		snapshot, err := tx.LastInsertID(&snapshotPO{ // 添加快照
			Comment: comment,
			Content: a.Content,
			Created: ctx.Begin(),
			Rate:    a.Rate,
		})
		if err != nil {
			return err
		}

		// 更新 Comment.Last
		_, err = tx.Update(&commentPO{ID: comment, Last: snapshot})
		return err
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

// HandlePatchComment 修改评论的内容
//
// comment 为评论的 ID；
// creator 作者，必须与添加时的 creator 一致；
func (m *Module) HandlePatchComment(ctx *web.Context, creator, comment int64) web.Responser {
	ar := &commentPO{ID: comment}
	found, err := m.db.Select(ar)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found || ar.Deleted.Valid {
		return ctx.NotFound()
	}

	if ar.Creator != creator {
		return ctx.Problem(cmfx.ForbiddenMustBeAuthor)
	}

	a := &CommentTO{m: m}
	if resp := ctx.Read(true, a, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	m.db.DoTransactionTx(ctx, nil, func(tx *orm.Tx) error {
		last, err := tx.LastInsertID(&snapshotPO{ // 添加快照
			Comment: comment,
			Content: a.Content,
			Created: ctx.Begin(),
			Rate:    a.Rate,
		})
		if err != nil {
			return err
		}

		_, err = tx.Update(&commentPO{ // 更新评论
			ID:       comment,
			Last:     last,
			Modified: ctx.Begin(),
		})
		return err
	})

	return web.NoContent()
}

// HandleDeleteComment 删除指定的评论
//
// comment 为评论的 ID；
// creator 作者，必须与添加时的 creator 一致；
func (m *Module) HandleDeleteComment(ctx *web.Context, creator, comment int64) web.Responser {
	a := &commentPO{ID: comment}
	found, err := m.db.Select(a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found || a.Deleted.Valid {
		return ctx.NotFound()
	}

	if a.Creator != creator {
		return ctx.Problem(cmfx.ForbiddenMustBeAuthor)
	}

	po := &commentPO{
		ID:      comment,
		Deleted: sql.NullTime{Valid: true, Time: ctx.Begin()},
	}
	if _, err := m.db.Update(po); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

// SnapshotVO 摘要信息
type SnapshotVO struct {
	XMLName struct{}  `xml:"comment" json:"-" yaml:"-" cbor:"-" orm:"-"`
	Comment int64     `xml:"comment" json:"comment" yaml:"comment" cbor:"comment" orm:"name(comment)"` // 关联的评论
	ID      int64     `xml:"id" json:"id" yaml:"id" cbor:"id" orm:"name(id)"`
	Created time.Time `xml:"created" json:"created" yaml:"created" cbor:"created" orm:"name(created)"`
	Content string    `xml:"content" json:"content" yaml:"content" cbor:"content" orm:"name(content)"`
	Rate    int64     `xml:"rate" json:"rate" yaml:"rate" cbor:"rate" orm:"name(rate)"`
}

// HandleGetSnapshots 获取评论的快照列表
//
// comment 评论的 ID；
// 返回 []SnapshotVO；
func (m *Module) HandleGetSnapshots(ctx *web.Context, comment int64) web.Responser {
	q := &query.Text{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&snapshotPO{}), "s").
		Column("s.id,a.id as comment,s.created,s.created AS modified,s.content,s.rate").
		Join("LEFT", orm.TableName(&commentPO{}), "a", "a.id=s.comment").
		Where("a.id=?", comment).
		AndIsNull("a.deleted")

	if q.Text != "" {
		txt := "%" + q.Text + "%"
		sql.Where("a.slug LIKE ? OR s.title LIKE ? OR s.author LIKE ?", txt, txt, txt)
	}

	return query.PagingResponser[SnapshotVO](ctx, &q.Limit, sql, nil)
}

// HandleGetSnapshot 获取快照的详细信息
//
// NOTE: 关联的评论一旦删除，快照也将不可获取。
//
// snapshot 为快照的 ID；
func (m *Module) HandleGetSnapshot(ctx *web.Context, snapshot int64) web.Responser {
	sql := m.db.SQLBuilder().Select().From(orm.TableName(&snapshotPO{}), "s").
		Column("a.id as comment").
		Column("s.created,s.content,s.rate,s.id").
		Join("LEFT", orm.TableName(&commentPO{}), "a", "a.last=s.id").
		Where("s.id=?", snapshot).
		AndIsNull("a.deleted")

	a := &SnapshotVO{}
	size, err := sql.QueryObject(true, a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if size == 0 {
		return ctx.NotFound()
	}

	return web.OK(a)
}
