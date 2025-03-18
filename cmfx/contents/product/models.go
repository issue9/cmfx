// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package product

import (
	"database/sql"
	"time"

	xtypes "github.com/issue9/orm/v6/types"

	"github.com/issue9/cmfx/cmfx/types"
)

type snapshotPO struct {
	ID      int64         `orm:"name(id);ai"`
	NO      string        `orm:"name(no);len(20)"`
	Product int64         `orm:"name(article)"`          // 所属的商品 ID
	Title   string        `orm:"name(title);len(100)"`   // 标题
	Images  types.Strings `orm:"name(images);len(1000)"` // 缩略图
	Content string        `orm:"name(content);len(-1)"`  // 文章内容
	Created time.Time     `orm:"name(created)"`
	Creator int64         `orm:"name(creator)"`
}

type productPO struct {
	ID       int64  `orm:"name(id);ai"`
	NO       string `orm:"name(no);len(20)"`
	Last     int64  `orm:"name(last)"`         // 最后一次的快照 ID
	Order    int    `orm:"name(order)"`        // 排序，按从小到大排序
	Top      bool   `orm:"name(top)"`          // 是否置顶
	Merchant int64  `orm:"name(merchant)"`     // 所属的商家
	Sold     int    `orm:"name(sold)"`         // 销量
	Unit     string `orm:"name(unit);len(20)"` // 计量单位

	Created  time.Time    `orm:"name(created)"`
	Creator  int64        `orm:"name(creator)"`
	Modified time.Time    `orm:"name(modified)"`
	Modifier int64        `orm:"name(modifier)"`
	Deleted  sql.NullTime `orm:"name(deleted);nullable"`
	Deleter  int64        `orm:"name(deleter)"`
}

// 所有的商品属性组合之后的价格等信息
type skuPO struct {
	ID      int64  `orm:"name(id);ai"`
	NO      string `orm:"name(no);len(20)"`
	Product int64  `orm:"name(product)"`

	// 对应商品的各个属性的 ID
	//
	// 长度与 [eav.Attributes()] 的长度是相同的。
	Values types.Int64s `orm:"name(values);len(1000);unique(values)"`

	Price   xtypes.Decimal `orm:"name(price)"`   // 价格
	Count   int64          `orm:"name(count)"`   // 总数量
	Balance int64          `orm:"name(balance)"` // 剩余数量
	Deleted sql.NullTime   `orm:"name(deleted);nullable"`
}

func (*snapshotPO) TableName() string { return "_product_snapshots" }

func (*productPO) TableName() string { return "_products" }

func (*skuPO) TableName() string { return "_product_skus" }
