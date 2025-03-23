// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package product

import (
	"time"

	"github.com/issue9/web"

	"github.com/issue9/cmfx/cmfx/query"
	"github.com/issue9/cmfx/cmfx/types"
)

type OverviewVO struct {
	XMLName struct{} `orm:"-" json:"-" yaml:"-" cbor:"-" xml:"product"`

	ID       int64         `orm:"name(id)" json:"id,omitempty" yaml:"id,omitempty" cbor:"id,omitempty" xml:"id,attr,omitempty"`
	NO       string        `orm:"name(no)" json:"no" yaml:"no" cbor:"no" xml:"no,attr"`
	Order    int           `orm:"name(order)" json:"order" yaml:"order" cbor:"order" xml:"order,attr"`
	Title    string        `orm:"name(title)" json:"title" yaml:"title" cbor:"title" xml:"title"`
	Images   types.Strings `orm:"name(images)" json:"images" yaml:"images" cbor:"images" xml:"images>image"`
	Created  time.Time     `orm:"name(created)" json:"created" yaml:"created" cbor:"created" xml:"created"`
	Modified time.Time     `orm:"name(modified)" json:"modified" yaml:"modified" cbor:"modified" xml:"modified"`
	Merchant int64         `orm:"name(merchant)" json:"merchant,omitempty" yaml:"merchant,omitempty" cbor:"merchant,omitempty" xml:"merchant,attr,omitempty"`
}

type OverviewQuery struct {
	MerchantOverviewQuery
	Merchant []int64 `query:"merchant"`
}

func (m *Module) HandleGetProducts(ctx *web.Context) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

type MerchantOverviewQuery struct {
	query.Text
	CreatedStart  time.Time `query:"created-start"`
	CreatedEnd    time.Time `query:"created-end"`
	ModifiedStart time.Time `query:"modified-start"`
	ModifiedEnd   time.Time `query:"modified-end"`
}

func (m *Module) HandleGetProductsByMerchant(ctx *web.Context, merchant int64) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

type ProductVO struct {
	XMLName struct{} `orm:"-" json:"-" yaml:"-" cbor:"-" xml:"product"`

	ID       int64         `orm:"name(id)" json:"id,omitempty" yaml:"id,omitempty" cbor:"id,omitempty" xml:"id,attr,omitempty"`
	NO       string        `orm:"name(no)" json:"no" yaml:"no" cbor:"no" xml:"no,attr"`
	Merchant int64         `orm:"name(merchant)" json:"merchant,omitempty" yaml:"merchant,omitempty" cbor:"merchant,omitempty" xml:"merchant,attr,omitempty"`
	Order    int           `orm:"name(order)" json:"order" yaml:"order" cbor:"order" xml:"order,attr"`
	Title    string        `orm:"name(title)" json:"title" yaml:"title" cbor:"title" xml:"title"`
	Images   types.Strings `orm:"name(images)" json:"images" yaml:"images" cbor:"images" xml:"images>image"`
	Content  string        `orm:"name(content)" json:"content" yaml:"content" cbor:"content" xml:"content"`
	Created  time.Time     `orm:"name(created)" json:"created" yaml:"created" cbor:"created" xml:"created"`
	Modified time.Time     `orm:"name(modified)" json:"modified" yaml:"modified" cbor:"modified" xml:"modified"`
}

func (m *Module) HandleGetProduct(ctx *web.Context, id int64) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

func (m *Module) HandleGetProductByNO(ctx *web.Context, no string) web.Responser {
	// TODO
	return ctx.NotImplemented()
}

func (m *Module) HandleGetAttributes(ctx *web.Context, no string) web.Responser {
	attrs, err := m.attrs.GetAttributes()
	if err != nil {
		return ctx.Error(err, "")
	}
	return web.OK(attrs)
}
