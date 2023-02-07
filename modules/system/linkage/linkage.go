// SPDX-License-Identifier: MIT

// Package linkage 存在上下级关系的链表
package linkage

import (
	"encoding/json"
	"errors"

	"github.com/issue9/orm/v5"
	"github.com/issue9/web"
)

var (
	marshal   = json.Marshal
	unmarshal = json.Unmarshal
)

var errNotFound = errors.New("not found")

type Linkage struct {
	s        *web.Server
	dbPrefix orm.Prefix
	db       *orm.DB
}

// ErrNotFound 表示数据项未找到
func ErrNotFound() error { return errNotFound }

// New 声明 Linkage 模块
func New(s *web.Server, tableName string, db *orm.DB) *Linkage {
	return &Linkage{
		s:        s,
		dbPrefix: orm.Prefix(tableName),
		db:       db,
	}
}
