// SPDX-License-Identifier: MIT

// Package passport 验证系统
package passport

import (
	"errors"

	"github.com/issue9/orm/v5"
)

const defaultCost = 11

var (
	ErrExists = errors.New("user already exists")

	ErrUnauthorized = errors.New("unauthorized")
)

// Passport 当前模块对外公开的接口
type Passport struct {
	dbPrefix orm.Prefix
	db       *orm.DB
}

func New(mod string, db *orm.DB) *Passport {
	return &Passport{
		dbPrefix: orm.Prefix(mod),
		db:       db,
	}
}

func (p *Passport) modelEngine(tx *orm.Tx) orm.ModelEngine {
	if tx == nil {
		return p.dbPrefix.DB(p.db)
	} else {
		return p.dbPrefix.Tx(tx)
	}
}
