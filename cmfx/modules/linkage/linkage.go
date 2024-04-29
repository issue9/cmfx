// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package linkage 存在上下级关系的链表
package linkage

import (
	"encoding/json"

	"github.com/issue9/cmfx/cmfx"
)

var (
	marshal   = json.Marshal
	unmarshal = json.Unmarshal
)

type Linkage struct {
	*cmfx.Module
}

// New 声明 Linkage 模块
func New(mod *cmfx.Module) *Linkage {
	return &Linkage{Module: mod}
}
