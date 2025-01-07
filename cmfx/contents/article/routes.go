// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package article

import (
	"database/sql"
	"time"

	"github.com/issue9/orm/v6"
	"github.com/issue9/orm/v6/fetch"
	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/filters"
	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
)

// OverviewVO 文章摘要信息
type OverviewVO struct {
	XMLName struct{} `xml:"overview" json:"-" yaml:"-" cbor:"-" orm:"-"`

	ID       int64     `xml:"id" json:"id" yaml:"id" cbor:"id" orm:"name(id)"`
	Slug     string    `xml:"slug" json:"slug" yaml:"slug" cbor:"slug" orm:"name(slug)"`
	Views    int       `xml:"views" json:"views" yaml:"views" cbor:"views" orm:"name(views)"`
	Order    int       `xml:"order" json:"order" yaml:"order" cbor:"order" orm:"name(order)"`
	Author   string    `xml:"author" json:"author" yaml:"author" cbor:"author" orm:"name(author)"`
	Title    string    `xml:"title" json:"title" yaml:"title" cbor:"title" orm:"name(title)"`
	Created  time.Time `xml:"created" json:"created" yaml:"created" cbor:"created" orm:"name(created)"`
	Modified time.Time `xml:"modified" json:"modified" yaml:"modified" cbor:"modified" orm:"name(modified)"`
}

type OverviewQuery struct {
	m *Module
	query.Text
	Created time.Time `query:"created"`
	// TODO 添加 Tags,Topics 查询
}

func (q *OverviewQuery) Filter(ctx *web.FilterContext) {
	q.Text.Filter(ctx)
}

// HandleGetArticles 获取文章列表
//
// 查询参数为 [OverviewQuery]，返回对象为 [query.Page[OverviewVO]]
func (m *Module) HandleGetArticles(ctx *web.Context) web.Responser {
	q := &OverviewQuery{m: m}
	if resp := ctx.Read(true, q, cmfx.BadRequestInvalidQuery); resp != nil {
		return resp
	}

	sql := m.db.SQLBuilder().Select().From(orm.TableName(&articlePO{}), "a").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "a.last=s.id")
	if !q.Created.IsZero() {
		sql.Where("a.created>?", q.Created)
	}
	if q.Text.Text != "" {
		txt := "%" + q.Text.Text + "%"
		sql.Where("a.slug LIKE ? OR s.title LIKE ? OR s.author LIKE ?", txt, txt, txt)
	}

	return query.PagingResponser[OverviewVO](ctx, &q.Limit, sql, nil)
}

// ArticleVO 文章的详细内容
type ArticleVO struct {
	XMLName struct{} `xml:"article" json:"-" yaml:"-" cbor:"-" orm:"-"`

	ID       int64         `orm:"name(id);ai" json:"id" yaml:"id" cbor:"id" xml:"id,attr"`
	Slug     string        `orm:"name(slug);len(100);unique(slug)" json:"slug" yaml:"slug" cbor:"slug" xml:"slug"`
	Views    int           `orm:"name(views)" json:"views" yaml:"views" cbor:"views" xml:"views,attr"`
	Order    int           `orm:"name(order)" json:"order" yaml:"order" cbor:"order" xml:"order,attr"`
	Author   string        `orm:"name(author);len(20)" json:"author" yaml:"author" cbor:"author" xml:"author"`
	Title    string        `orm:"name(title);len(100)" json:"title" yaml:"title" cbor:"title" xml:"title"`
	Images   types.Strings `orm:"name(images);len(1000)" json:"images" yaml:"images" cbor:"images" xml:"images>image"`
	Keywords string        `orm:"name(keywords)" json:"keywords" yaml:"keywords" cbor:"keywords" xml:"keywords"`
	Summary  string        `orm:"name(summary);len(2000)" json:"summary" yaml:"summary" cbor:"summary" xml:"summary,cdata"`
	Content  string        `orm:"name(content);len(-1)" json:"content" yaml:"content" cbor:"content" xml:"content,cdata"`

	Created  time.Time `orm:"name(created)" json:"created" yaml:"created" cbor:"created" xml:"created"`
	Modified time.Time `orm:"name(modified)" json:"modified" yaml:"modified" cbor:"modified" xml:"modified"`

	// 分类信息
	Topics []int64 `orm:"-" json:"topics" yaml:"topics" cbor:"topics" xml:"topics>topic"`
	Tags   []int64 `orm:"-" json:"tags" yaml:"tags" cbor:"tags" xml:"tags>tag"`

	// 用于保存最后一次的快照 ID
	Last int64 `orm:"name(last)" json:"-" yaml:"-" cbor:"-" xml:"-"`
}

// HandleGetArticle 获取指定文章的详细信息
//
// 返回参数的实际类型为 [ArticleVO]；
// article 为文章的 ID，使用都需要确保值的正确性；
func (m *Module) HandleGetArticle(ctx *web.Context, article string) web.Responser {
	a := &ArticleVO{}
	size, err := m.db.SQLBuilder().Select().From(orm.TableName(&articlePO{}), "a").
		Column("a.slug,a.views,a.order,a.created,a.modified,a.deleted,a.deleter,a.last").
		Column("s.author,s.title,s.images,s.summary,s.content,s.tags,s.topics").
		Join("LEFT", orm.TableName(&snapshotPO{}), "s", "a.last=s.id").
		Where("a.id=?", article).
		QueryObject(true, a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if size == 0 {
		return ctx.NotFound()
	}

	rows, err := m.db.SQLBuilder().Select().
		Where("snapshot=?", a.Last).
		From(orm.TableName(&tagRelationPO{})).
		Column("tag").
		Query()
	if err != nil {
		return ctx.Error(err, "")
	}
	a.Tags, err = fetch.Column[int64](true, "tag", rows)
	if err != nil {
		return ctx.Error(err, "")
	}

	rows, err = m.db.SQLBuilder().Select().
		Where("snapshot=?", a.Last).
		From(orm.TableName(&topicRelationPO{})).
		Column("topic").
		Query()
	if err != nil {
		return ctx.Error(err, "")
	}
	a.Topics, err = fetch.Column[int64](true, "topic", rows)
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(a)
}

type ArticleTO struct {
	m *Module

	XMLName  struct{} `xml:"article" json:"-" yaml:"-" cbor:"-"`
	Author   string   `json:"author" yaml:"author" cbor:"author" xml:"author"`
	Title    string   `json:"title" yaml:"title" cbor:"title" xml:"title"`
	Images   []string `json:"images" yaml:"images" cbor:"images" xml:"images>image"`
	Keywords string   `json:"keywords" yaml:"keywords" cbor:"keywords" xml:"keywords"`
	Summary  string   `json:"summary" yaml:"summary" cbor:"summary" xml:"summary"`
	Content  string   `json:"content" yaml:"content" cbor:"content" xml:"content"`
	Topics   []int64  `json:"topics" yaml:"topics" cbor:"topics" xml:"topics>topic"`
	Tags     []int64  `json:"tags" yaml:"tags" cbor:"tags" xml:"tags>tag"`
	Slug     string   `json:"slug" yaml:"slug" cbor:"slug" xml:"slug"`
	Views    int      `json:"views" yaml:"views" cbor:"views" xml:"views"`
	Order    int      `json:"order" yaml:"order" cbor:"order" xml:"order"`
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
func (m *Module) HandlePostArticle(ctx *web.Context, creator int64) web.Responser {
	a := &ArticleTO{m: m}
	if resp := ctx.Read(true, a, cmfx.BadRequestInvalidBody); resp != nil {
		return resp
	}

	err := m.db.DoTransactionTx(ctx, nil, func(tx *orm.Tx) error {
		last, err := tx.LastInsertID(&snapshotPO{ // 添加快照
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

		article, err := tx.LastInsertID(&articlePO{ // 添加文章
			Slug:     a.Slug,
			Last:     last,
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

		// 插入标签关系表
		if l := len(a.Tags); l > 0 {
			tags := make([]orm.TableNamer, 0, l)
			for _, t := range a.Tags {
				tags = append(tags, &tagRelationPO{Tag: t, Snapshot: last})
			}
			if err = tx.InsertMany(50, tags...); err != nil {
				return err
			}
		}

		// 插入主题关系表
		if l := len(a.Topics); l > 0 {
			topics := make([]orm.TableNamer, 0, l)
			for _, t := range a.Topics {
				topics = append(topics, &topicRelationPO{Topic: t, Snapshot: last})
			}
			if err = tx.InsertMany(50, topics...); err != nil {
				return err
			}
		}

		// 更新快照对应的文章 ID
		_, err = tx.Update(&snapshotPO{ID: last, Article: article})
		return err
	})
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.Created(nil, "")
}

type ArticlePatchTO struct {
	m *Module

	XMLName  struct{} `xml:"article" json:"-" yaml:"-" cbor:"-"`
	Author   string   `json:"author" yaml:"author" cbor:"author" xml:"author"`
	Title    string   `json:"title" yaml:"title" cbor:"title" xml:"title"`
	Images   []string `json:"images" yaml:"images" cbor:"images" xml:"images>image"`
	Keywords string   `json:"keywords" yaml:"keywords" cbor:"keywords" xml:"keywords"`
	Summary  string   `json:"summary" yaml:"summary" cbor:"summary" xml:"summary"`
	Content  string   `json:"content" yaml:"content" cbor:"content" xml:"content"`
	Topics   []int64  `json:"topics" yaml:"topics" cbor:"topics" xml:"topics>topic"`
	Tags     []int64  `json:"tags" yaml:"tags" cbor:"tags" xml:"tags>tag"`
}

func (to *ArticlePatchTO) Filter(ctx *web.FilterContext) {
	ctx.Add(to.m.Topics().SliceFilter()("topics", &to.Topics)).
		Add(to.m.Tags().SliceFilter()("tags", &to.Tags))
}

// HandlePatchArticle 修改文章的内容
//
// article 为文章的 ID，调用者需要确保值的正确性；
// modifier 为修改者的 ID，调用者需要确保值的正确性；
func (m *Module) HandlePatchArticle(ctx *web.Context, article, modifier int64) web.Responser {
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

		// 插入标签关系表，不需要删除旧的关系因为 snapshot 是新的。
		if l := len(a.Tags); l > 0 {
			tags := make([]orm.TableNamer, 0, l)
			for _, t := range a.Tags {
				tags = append(tags, &tagRelationPO{Tag: t, Snapshot: last})
			}
			if err = tx.InsertMany(50, tags...); err != nil {
				return err
			}
		}

		// 插入主题关系表
		if l := len(a.Topics); l > 0 {
			topics := make([]orm.TableNamer, 0, l)
			for _, t := range a.Topics {
				topics = append(topics, &topicRelationPO{Topic: t, Snapshot: last})
			}
			if err = tx.InsertMany(50, topics...); err != nil {
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
// article 为文章的 ID，调用者需要确保值的正确性；
// deleter 为删除者的 ID，调用者需要确保值的正确性；
func (m *Module) HandleDeleteArticle(ctx *web.Context, article, deleter int64) web.Responser {
	po := &articlePO{
		ID:      article,
		Deleted: sql.NullTime{Valid: true, Time: ctx.Begin()},
		Deleter: deleter,
	}

	if _, err := m.db.Update(po); err != nil {
		return ctx.Error(err, "")
	}
	return web.NoContent()
}

// HandleGetSnapshots 获取文章的快照列表
//
// article 更新快照对应的文章 ID；
// 返回 []string，为文章对应的快照 ID 列表；
func (m *Module) HandleGetSnapshots(ctx *web.Context, article int64) web.Responser {
	rows, err := m.db.SQLBuilder().Select().
		From(orm.TableName(&snapshotPO{})).
		Column("id").
		Where("article=?", article).
		Query()
	if err != nil {
		return ctx.Error(err, "")
	}

	ids, err := fetch.Column[int64](false, "id", rows)
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(ids)
}

// HandleGetSnapshot 获取快照的详细信息
//
// snapshot 为快照的 ID；
func (m *Module) HandleGetSnapshot(ctx *web.Context, snapshot int64) web.Responser {
	sql := m.db.SQLBuilder().Select().From(orm.TableName(&snapshotPO{}), "s").
		Column("a.slug,a.views,a.order,a.created,a.modified,a.deleted,a.deleter,a.last").
		Column("s.author,s.title,s.images,s.summary,s.content,s.tags,s.topics").
		Join("LEFT", orm.TableName(&articlePO{}), "a", "a.last=s.id").
		Where("s.id=?", snapshot)

	a := &ArticleVO{}
	size, err := sql.QueryObject(true, a)
	if err != nil {
		return ctx.Error(err, "")
	}
	if size == 0 {
		return ctx.NotFound()
	}

	rows, err := m.db.SQLBuilder().Select().
		Where("snapshot=?", a.Last).
		From(orm.TableName(&tagRelationPO{})).
		Column("tag").
		Query()
	if err != nil {
		return ctx.Error(err, "")
	}
	a.Tags, err = fetch.Column[int64](true, "tag", rows)
	if err != nil {
		return ctx.Error(err, "")
	}

	rows, err = m.db.SQLBuilder().Select().
		Where("snapshot=?", a.Last).
		From(orm.TableName(&topicRelationPO{})).
		Column("topic").
		Query()
	if err != nil {
		return ctx.Error(err, "")
	}
	a.Topics, err = fetch.Column[int64](true, "topic", rows)
	if err != nil {
		return ctx.Error(err, "")
	}

	return web.OK(a)
}
