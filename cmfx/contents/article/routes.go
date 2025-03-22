// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"database/sql"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/sqlbuilder"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
)

// OverviewVO 文章摘要信息
type OverviewVO struct {
	XMLName struct{} `xml:"overview" json:"-" yaml:"-" cbor:"-" orm:"-" toml:"-"`

	ID       int64     `xml:"id" json:"id" yaml:"id" cbor:"id" toml:"id" orm:"name(id)"`
	Slug     string    `xml:"slug" json:"slug" yaml:"slug" cbor:"slug" toml:"slug" orm:"name(slug)"`
	Views    int       `xml:"views" json:"views" yaml:"views" cbor:"views" toml:"views" orm:"name(views)"`
	Order    int       `xml:"order" json:"order" yaml:"order" cbor:"order" toml:"order" orm:"name(order)"`
	Author   string    `xml:"author" json:"author" yaml:"author" cbor:"author" toml:"author" orm:"name(author)"`
	Title    string    `xml:"title" json:"title" yaml:"title" cbor:"title" toml:"title" orm:"name(title)"`
	Created  time.Time `xml:"created" json:"created" yaml:"created" cbor:"created" toml:"created" orm:"name(created)"`
	Modified time.Time `xml:"modified" json:"modified" yaml:"modified" cbor:"modified" toml:"modified" orm:"name(modified)"`
}

type OverviewQuery struct {
	m *Module
	query.Text
	Created time.Time `query:"created"`
	Tags    []int64   `query:"tag"`
	Topics  []int64   `query:"topic"`
}

func (q *OverviewQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
	ctx.Add(q.m.Tags().SliceFilter()("tag", &q.Tags)).
		Add(q.m.Topics().SliceFilter()("topic", &q.Topics))
}

type TopicOverviewQuery struct {
	m *Module
	query.Text
	Created time.Time `query:"created"`
	Tags    []int64   `query:"tag"`
}

func (q *TopicOverviewQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
	ctx.Add(q.m.Tags().SliceFilter()("tag", &q.Tags))
}

type TagOverviewQuery struct {
	m *Module
	query.Text
	Created time.Time `query:"created"`
	Topics  []int64   `query:"topic"`
}

func (q *TagOverviewQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
	ctx.Add(q.m.Topics().SliceFilter()("topic", &q.Topics))
}

// HandleGetArticles 获取文章列表
//
// 查询参数为 [OverviewQuery]，返回对象为 [query.Page[OverviewVO]]
func (m *Module) HandleGetArticles(ctx *web.Context) web.Responser {
	q := &OverviewQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&articlePO{}), "a").
		Column("a.id,a.slug,a.views,a.{order},s.title,a.created,a.modified").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "a.last=s.id").
		AndIsNull("a.deleted").
		Desc("a.{order}")
	if !q.Created.IsZero() {
		sql.Where("a.created>?", q.Created)
	}
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("a.slug LIKE ? OR s.title LIKE ? OR s.author LIKE ?", txt, txt, txt)
	}
	if len(q.Tags) > 0 {
		m.tagRel.LeftJoin(sql, "tags", "tags.v1=a.id")
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, t := range q.Tags {
				ws.Or("tags.v2=?", t)
			}
		})
	}
	if len(q.Topics) > 0 {
		m.topicRel.LeftJoin(sql, "topics", "topics.v1=a.id")
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, t := range q.Topics {
				ws.Or("topics.v2=?", t)
			}
		})
	}

	return query.PagingResponser[OverviewVO](ctx, &q.Limit, sql, nil)
}

// HandleGetArticlesByTopic 获取文章列表
//
// 查询参数为 [TopicOverviewQuery]，返回对象为 [query.Page[OverviewVO]]
func (m *Module) HandleGetArticlesByTopic(ctx *web.Context, topic int64) web.Responser {
	q := &OverviewQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&articlePO{}), "a").
		Column("a.id,a.slug,a.views,a.{order},s.title,a.created,a.modified").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "a.last=s.id").
		AndIsNull("a.deleted").
		And("topic.v2=?", topic).
		Desc("a.{order}")
	m.topicRel.LeftJoin(sql, "topic", "topic.v1=a.id")
	if !q.Created.IsZero() {
		sql.Where("a.created>?", q.Created)
	}
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("a.slug LIKE ? OR s.title LIKE ? OR s.author LIKE ?", txt, txt, txt)
	}
	if len(q.Tags) > 0 {
		m.tagRel.LeftJoin(sql, "tags", "tags.v1=a.id")
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, t := range q.Tags {
				ws.Or("tags.v2=?", t)
			}
		})
	}

	return query.PagingResponser[OverviewVO](ctx, &q.Limit, sql, nil)
}

// HandleGetArticlesByTag 获取文章列表
//
// 查询参数为 [TagOverviewQuery]，返回对象为 [query.Page[OverviewVO]]
func (m *Module) HandleGetArticlesByTag(ctx *web.Context, tag int64) web.Responser {
	q := &OverviewQuery{m: m}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&articlePO{}), "a").
		Column("a.id,a.slug,a.views,a.{order},s.title,a.created,a.modified").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "a.last=s.id").
		AndIsNull("a.deleted").
		And("tag.v2=?", tag).
		Desc("a.{order}")
	m.tagRel.LeftJoin(sql, "tag", "tag.v1=a.id")
	if !q.Created.IsZero() {
		sql.Where("a.created>?", q.Created)
	}
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("a.slug LIKE ? OR s.title LIKE ? OR s.author LIKE ?", txt, txt, txt)
	}
	if len(q.Tags) > 0 {
		m.tagRel.LeftJoin(sql, "tags", "tags.v1=a.id")
		sql.AndGroup(func(ws *sqlbuilder.WhereStmt) {
			for _, t := range q.Tags {
				ws.Or("tags.v2=?", t)
			}
		})
	}

	return query.PagingResponser[OverviewVO](ctx, &q.Limit, sql, nil)
}

// ArticleVO 文章的详细内容
type ArticleVO struct {
	XMLName struct{} `xml:"article" json:"-" yaml:"-" cbor:"-" orm:"-" toml:"-"`

	ID       int64         `orm:"name(id)" json:"id" yaml:"id" cbor:"id" toml:"id" xml:"id,attr"`
	Snapshot int64         `orm:"name(snapshot)" json:"snapshot" yaml:"snapshot" cbor:"snapshot" toml:"snapshot" xml:"snapshot,attr"` // 此文章对应的快照 ID
	Slug     string        `orm:"name(slug);len(100);unique(slug)" json:"slug" yaml:"slug" cbor:"slug" toml:"slug" xml:"slug"`
	Views    int           `orm:"name(views)" json:"views" yaml:"views" cbor:"views" toml:"views" xml:"views,attr"`
	Order    int           `orm:"name(order)" json:"order" yaml:"order" cbor:"order" toml:"order" xml:"order,attr"`
	Author   string        `orm:"name(author);len(20)" json:"author" yaml:"author" cbor:"author" toml:"author" xml:"author"`
	Title    string        `orm:"name(title);len(100)" json:"title" yaml:"title" cbor:"title" toml:"title" xml:"title"`
	Images   types.Strings `orm:"name(images);len(1000)" json:"images" yaml:"images" cbor:"images" toml:"images" xml:"images>image"`
	Keywords string        `orm:"name(keywords)" json:"keywords" yaml:"keywords" cbor:"keywords" toml:"keywords" xml:"keywords"`
	Summary  string        `orm:"name(summary);len(2000)" json:"summary" yaml:"summary" cbor:"summary" toml:"summary" xml:"summary,cdata"`
	Content  string        `orm:"name(content);len(-1)" json:"content" yaml:"content" cbor:"content" toml:"content" xml:"content,cdata"`

	Created  time.Time `orm:"name(created)" json:"created" yaml:"created" cbor:"created" toml:"created" xml:"created"`
	Modified time.Time `orm:"name(modified)" json:"modified" yaml:"modified" cbor:"modified" toml:"modified" xml:"modified"`

	// 分类信息
	Topics []int64 `orm:"-" json:"topics" yaml:"topics" cbor:"topics" toml:"topics" xml:"topics>topic"`
	Tags   []int64 `orm:"-" json:"tags" yaml:"tags" cbor:"tags" toml:"tags" xml:"tags>tag"`

	// 用于保存最后一次的快照 ID
	Last int64 `orm:"name(last)" json:"-" yaml:"-" cbor:"-" toml:"-" xml:"-"`
}

// HandleGetArticle 获取指定文章的详细信息
//
// 返回参数的实际类型为 [ArticleVO]；
// article 为文章的 ID，使用都需要确保值的正确性；
func (m *Module) HandleGetArticle(ctx *web.Context, article int64) web.Responser {
	a := &ArticleVO{}
	size, err := m.db.SQLBuilder().Select().From(orm.TableName(&articlePO{}), "a").
		Column("a.id,a.slug,a.views,a.{order},a.created,a.modified,a.last").
		Column("s.author,s.title,s.images,s.summary,s.content,s.id as snapshot").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "a.last=s.id").
		Where("a.id=?", article).
		AndIsNull("a.deleted").
		QueryObject(true, a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if size == 0 {
		return ctx.NotFound()
	}

	a.Topics, a.Tags, err = m.getArticleAttribute(a.ID)
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(a)
}

type ArticleTO struct {
	m *Module

	XMLName  struct{} `xml:"article" json:"-" yaml:"-" cbor:"-" toml:"-"`
	Author   string   `json:"author" yaml:"author" cbor:"author" xml:"author" toml:"author"`
	Title    string   `json:"title" yaml:"title" cbor:"title" xml:"title" toml:"title"`
	Images   []string `json:"images" yaml:"images" cbor:"images" xml:"images>image" toml:"images"`
	Keywords string   `json:"keywords" yaml:"keywords" cbor:"keywords" xml:"keywords" toml:"keywords"`
	Summary  string   `json:"summary" yaml:"summary" cbor:"summary" xml:"summary" toml:"summary"`
	Content  string   `json:"content" yaml:"content" cbor:"content" xml:"content" toml:"content"`
	Topics   []int64  `json:"topics" yaml:"topics" cbor:"topics" xml:"topics>topic" toml:"topics"`
	Tags     []int64  `json:"tags" yaml:"tags" cbor:"tags" xml:"tags>tag" toml:"tags"`
	Slug     string   `json:"slug" yaml:"slug" cbor:"slug" xml:"slug" toml:"slug"`
	Views    int      `json:"views" yaml:"views" cbor:"views" xml:"views" toml:"views"`
	Order    int      `json:"order" yaml:"order" cbor:"order" xml:"order" toml:"order"`
}

func (to *ArticleTO) Filter(ctx *web.FilterContext) {
	ctx.Add(filters.NotEmpty("author", &to.Author)).
		Add(filters.NotEmpty("title", &to.Title)).
		Add(filters.NotEmpty("summary", &to.Summary)).
		Add(filters.NotEmpty("content", &to.Content)).
		Add(to.m.Tags().SliceFilter()("tags", &to.Tags)).
		Add(to.m.Topics().SliceFilter()("topics", &to.Topics)).
		Add(filters.GreatEqual(0)("views", &to.Views)).
		Add(filters.GreatEqual(0)("order", &to.Order))
}

// HandlePostArticle 创建新的文章
//
// creator 为创建者的 ID，调用者需要确保值的正确性；
// 提交类型为 [ArticleTO]；
func (m *Module) HandlePostArticle(ctx *web.Context, creator int64) web.Responser {
	a := &ArticleTO{m: m}
	if resp := ctx.Read(true, a, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	err := m.db.DoTransactionTx(ctx, nil, func(tx *orm.Tx) error {
		article, err := tx.LastInsertID(&articlePO{ // 添加文章
			Slug:     a.Slug,
			Views:    a.Views,
			Order:    a.Order,
			Created:  ctx.Begin(),
			Creator:  creator,
			Modified: ctx.Begin(),
			Modifier: creator,
		})
		if err != nil {
			return err
		}

		snapshot, err := tx.LastInsertID(&snapshotPO{ // 添加快照
			Article:  article,
			Author:   a.Author,
			Title:    a.Title,
			Images:   a.Images,
			Keywords: a.Keywords,
			Summary:  a.Summary,
			Content:  a.Content,
			Created:  ctx.Begin(),
			Creator:  creator,
		})
		if err != nil {
			return err
		}

		// 插入标签关系表
		for _, t := range a.Tags {
			if err := m.tagRel.Add(tx, article, t); err != nil {
				return err
			}
		}

		// 插入主题关系表
		for _, t := range a.Topics {
			if err := m.topicRel.Add(tx, article, t); err != nil {
				return err
			}
		}

		// 更新 Article.Last
		_, err = tx.Update(&articlePO{ID: article, Last: snapshot})
		return err
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

type ArticlePatchTO struct {
	m *Module

	XMLName  struct{} `xml:"article" json:"-" yaml:"-" cbor:"-" toml:"-"`
	Author   string   `json:"author" yaml:"author" cbor:"author" xml:"author" toml:"author"`
	Title    string   `json:"title" yaml:"title" cbor:"title" xml:"title" toml:"title"`
	Images   []string `json:"images" yaml:"images" cbor:"images" xml:"images>image" toml:"images"`
	Keywords string   `json:"keywords" yaml:"keywords" cbor:"keywords" xml:"keywords" toml:"keywords"`
	Summary  string   `json:"summary" yaml:"summary" cbor:"summary" xml:"summary" toml:"summary"`
	Content  string   `json:"content" yaml:"content" cbor:"content" xml:"content" toml:"content"`
	Topics   []int64  `json:"topics" yaml:"topics" cbor:"topics" xml:"topics>topic" toml:"topics"`
	Tags     []int64  `json:"tags" yaml:"tags" cbor:"tags" xml:"tags>tag" toml:"tags"`
}

func (to *ArticlePatchTO) Filter(ctx *web.FilterContext) {
	ctx.Add(to.m.Topics().SliceFilter()("topics", &to.Topics)).
		Add(to.m.Tags().SliceFilter()("tags", &to.Tags))
}

// HandlePatchArticle 修改文章的内容
//
// article 为文章的 ID；
// modifier 为修改者的 ID，调用者需要确保值的正确性；
func (m *Module) HandlePatchArticle(ctx *web.Context, article, modifier int64) web.Responser {
	ar := &articlePO{ID: article}
	found, err := m.db.Select(ar)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found || ar.Deleted.Valid {
		return ctx.NotFound()
	}

	a := &ArticlePatchTO{m: m}
	if resp := ctx.Read(true, a, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	m.db.DoTransactionTx(ctx, nil, func(tx *orm.Tx) error {
		last, err := tx.LastInsertID(&snapshotPO{ // 添加快照
			Author:   a.Author,
			Article:  article,
			Title:    a.Title,
			Images:   a.Images,
			Keywords: a.Keywords,
			Summary:  a.Summary,
			Content:  a.Content,
			Created:  ctx.Begin(),
			Creator:  modifier,
		})
		if err != nil {
			return err
		}

		if err = m.tagRel.DeleteByV1(tx, article); err != nil { // 删除旧的关系
			return err
		}
		for _, t := range a.Tags { // 插入标签关系表
			if err := m.tagRel.Add(tx, last, t); err != nil {
				return err
			}
		}

		if err = m.topicRel.DeleteByV1(tx, article); err != nil { // 删除旧的关系
			return err
		}
		for _, t := range a.Topics { // 插入主题关系表
			if err := m.topicRel.Add(tx, last, t); err != nil {
				return err
			}
		}

		_, err = tx.Update(&articlePO{ // 更新文章
			ID:       article,
			Last:     last,
			Modified: ctx.Begin(),
			Modifier: modifier,
		})
		return err
	})

	return web.NoContent()
}

// HandleDeleteArticle 删除指定的文章
//
// article 为文章的 ID；
// deleter 为删除者的 ID，调用者需要确保值的正确性；
func (m *Module) HandleDeleteArticle(ctx *web.Context, article, deleter int64) web.Responser {
	a := &articlePO{ID: article}
	found, err := m.db.Select(a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if !found || a.Deleted.Valid {
		return ctx.NotFound()
	}

	err = m.db.DoTransactionTx(ctx, nil, func(tx *orm.Tx) error {
		if err := m.tagRel.DeleteByV1(tx, article); err != nil { // 删除旧的关系
			return err
		}
		if err = m.topicRel.DeleteByV1(tx, article); err != nil { // 删除旧的关系
			return err
		}

		_, err = tx.NewEngine(m.db.TablePrefix()).Update(&articlePO{
			ID:      article,
			Deleted: sql.NullTime{Valid: true, Time: ctx.Begin()},
			Deleter: deleter,
		})
		return err
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.NoContent()
}

// SnapshotOverviewVO 文章快照的摘要信息
type SnapshotOverviewVO struct {
	XMLName struct{} `xml:"snapshot" json:"-" yaml:"-" cbor:"-" orm:"-" toml:"-"`

	Article int64     `xml:"article" json:"article" yaml:"article" cbor:"article" toml:"article" orm:"name(article)"` // 关联的文章
	ID      int64     `xml:"id" json:"id" yaml:"id" cbor:"id" toml:"id" orm:"name(id)"`                               // 快照 ID
	Author  string    `xml:"author" json:"author" yaml:"author" cbor:"author" toml:"author" orm:"name(author)"`
	Title   string    `xml:"title" json:"title" yaml:"title" cbor:"title" toml:"title" orm:"name(title)"`
	Created time.Time `xml:"created" json:"created" yaml:"created" cbor:"created" toml:"created" orm:"name(created)"`
}

// HandleGetSnapshots 获取文章的快照列表
//
// article 文章 ID；
// 返回 []OverviewVO；
func (m *Module) HandleGetSnapshots(ctx *web.Context, article int64) web.Responser {
	q := &query.Text{}
	if resp := ctx.QueryObject(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&snapshotPO{}), "s").
		Column("a.id as article,s.id,s.author,s.title,s.created").
		Join("LEFT", orm.TableName(&articlePO{}), "a", "a.id=s.article").
		Where("a.id=?", article).
		AndIsNull("a.deleted")

	if q.Text != "" {
		txt := "%" + q.Text + "%"
		sql.Where("a.slug LIKE ? OR s.title LIKE ? OR s.author LIKE ?", txt, txt, txt)
	}

	return query.PagingResponser[OverviewVO](ctx, &q.Limit, sql, nil)
}

// SnapshotVO 文章快照详细内容
type SnapshotVO struct {
	XMLName struct{} `xml:"article" json:"-" yaml:"-" cbor:"-" orm:"-" toml:"-"`

	ID       int64         `orm:"name(id)" json:"id" yaml:"id" cbor:"id" toml:"id" xml:"id,attr"`                               // 快照 ID
	Article  int64         `orm:"name(article)" json:"article" yaml:"article" cbor:"article" toml:"article" xml:"article,attr"` // 快照关联的文章 ID
	Slug     string        `orm:"name(slug);len(100);unique(slug)" json:"slug" yaml:"slug" cbor:"slug" toml:"slug" xml:"slug"`
	Author   string        `orm:"name(author);len(20)" json:"author" yaml:"author" cbor:"author" toml:"author" xml:"author"`
	Title    string        `orm:"name(title);len(100)" json:"title" yaml:"title" cbor:"title" toml:"title" xml:"title"`
	Images   types.Strings `orm:"name(images);len(1000)" json:"images" yaml:"images" cbor:"images" toml:"images" xml:"images>image"`
	Keywords string        `orm:"name(keywords)" json:"keywords" yaml:"keywords" cbor:"keywords" toml:"keywords" xml:"keywords"`
	Summary  string        `orm:"name(summary);len(2000)" json:"summary" yaml:"summary" cbor:"summary" toml:"summary" xml:"summary,cdata"`
	Content  string        `orm:"name(content);len(-1)" json:"content" yaml:"content" cbor:"content" toml:"content" xml:"content,cdata"`
	Created  time.Time     `orm:"name(created)" json:"created" yaml:"created" cbor:"created" toml:"created" xml:"created"`
}

// HandleGetSnapshot 获取快照的详细信息
//
// NOTE: 关联的文章一旦删除，快照也将不可获取。
//
// snapshot 为快照的 ID；
func (m *Module) HandleGetSnapshot(ctx *web.Context, snapshot int64) web.Responser {
	sql := m.db.SQLBuilder().Select().From(orm.TableName(&snapshotPO{}), "s").
		Column("a.id as article,a.slug").
		Column("s.author,s.created,s.title,s.images,s.summary,s.content,s.id").
		Join("LEFT", orm.TableName(&articlePO{}), "a", "a.last=s.id").
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

func (m *Module) getArticleAttribute(article int64) (topics, tags []int64, err error) {
	tags, err = m.tagRel.ListV2(article)
	if err != nil {
		return nil, nil, err
	}

	topics, err = m.topicRel.ListV2(article)
	return
}
