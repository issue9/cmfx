// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package linkage 存在上下级关系的链表
package linkage

import (
	"encoding/json"
	"errors"

	"github.com/issue9/cmfx"
)

var (
	marshal   = json.Marshal
	unmarshal = json.Unmarshal
)

var errNotFound = errors.New("not found")

type Linkage struct {
	cmfx.Module
}

// ErrNotFound 表示数据项未找到
func ErrNotFound() error { return errNotFound }

// New 声明 Linkage 模块
func New(mod cmfx.Module) *Linkage {
	return &Linkage{Module: mod}
}
