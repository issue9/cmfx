// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

package currency

import (
	"time"

	"github.com/issue9/orm/v6/core"
)

// 用户的货币总览表
type overviewPO struct {
	ID  int64 `orm:"name(id);ai"`
	UID int64 `orm:"name(uid);unique(uid)"`

	Available int64 `orm:"name(available)"` // 可用
	Freeze    int64 `orm:"name(freeze)"`    // 冻结
	Used      int64 `orm:"name(used)"`      // 已使用的
	Expire    int64 `orm:"name(expire)"`    // 会过期但是还没过期，已经包含在 available 中
}

func (p *overviewPO) TableName() string { return "_overviews" }

//------------------------------------- expire -----------------------------------

// 过期属性的明细表
//
// 相同过期时间的积分会合并，部分使用会被操作部分。
type expirePO struct {
	ID      int64     `orm:"name(id);ai"`
	UID     int64     `orm:"name(uid)"`
	Value   int64     `orm:"name(value)"`
	Expired time.Time `orm:"name(expired)"`
}

func (p *expirePO) TableName() string { return "_expires" }

//------------------------------------- log ---------------------------------------

//go:generate web enum -i=./models.go -o=./models_methods.go -t=Type

// Type 日志类型
type Type int8

const (
	TypeNormal Type = iota
	TypeFreeze
	TypeUnfreeze
)

func (Type) PrimitiveType() core.PrimitiveType { return core.String }

// LogPO 货币花费明细
type LogPO struct {
	ID  int64 `orm:"name(id);ai" json:"-" yaml:"-" xml:"-" cbor:"-"`
	UID int64 `orm:"name(uid)" json:"-" yaml:"-" xml:"-" cbor:"-"`

	Created time.Time `orm:"name(created)" json:"created" yaml:"created" xml:"created" cbor:"created"`
	Before  int64     `orm:"name(before)" json:"before" yaml:"before" xml:"before" cbor:"before" comment:"currency value before action"`
	After   int64     `orm:"name(after)" json:"after" yaml:"after" xml:"after" cbor:"after" comment:"currency value after action"`
	Value   int64     `orm:"name(value)" json:"value" yaml:"value" xml:"value" cbor:"value" comment:"add currency value"`
	Memo    string    `orm:"name(memo);len(1000)" json:"memo" yaml:"memo" xml:"memo" cbor:"memo" comment:"memo of action"`
	Type    Type      `orm:"name(type);len(10)" json:"type" yaml:"type" xml:"type" cbor:"type" comment:"type of action"`
}

func (p *LogPO) TableName() string { return "_logs" }

func (p *LogPO) BeforeInsert() error {
	p.Created = time.Now()
	return nil
}
