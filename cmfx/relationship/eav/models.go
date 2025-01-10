// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package eav

import (
	"database/sql"
	"time"
)

const (
	attrString   = "String"
	attrInt      = "Int"
	attrDatetime = "Datetime"
	attrfloat    = "Float"
)

type attrPO struct {
	ID      int64        `orm:"name(id);ai"`
	Name    string       `orm:"name(name);len(50)"`
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (*attrPO) TableName() string { return "_attrs" }

type valueIntPO struct {
	ID      int64        `orm:"name(id);ai"`
	Entity  int64        `orm:"name(entity)"`
	Attr    int64        `orm:"name(attr)"`
	Value   int64        `orm:"name(value)"`
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (*valueIntPO) TableName() string { return "_values_int" }

type valueStringPO struct {
	ID      int64        `orm:"name(id);ai"`
	Entity  int64        `orm:"name(entity)"`
	Attr    int64        `orm:"name(attr)"`
	Value   string       `orm:"name(value);len(-1)"`
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (*valueStringPO) TableName() string { return "_values_string" }

type valueDatetimePO struct {
	ID      int64        `orm:"name(id);ai"`
	Entity  int64        `orm:"name(entity)"`
	Attr    int64        `orm:"name(attr)"`
	Value   time.Time    `orm:"name(value)"`
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (*valueDatetimePO) TableName() string { return "_values_datetime" }

type valueFloatPO struct {
	ID      int64        `orm:"name(id);ai"`
	Entity  int64        `orm:"name(entity)"`
	Attr    int64        `orm:"name(attr)"`
	Value   float64      `orm:"name(value)"`
	Deleted sql.NullTime `orm:"name(deleted);nullable"`
}

func (*valueFloatPO) TableName() string { return "_values_float" }
