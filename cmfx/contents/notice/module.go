// SPDX-FileCopyrightText: 2025 caixw
//
// SPDX-License-Identifier: MIT

package notice

import (
	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/categories/tag"
	"github.com/issue9/cmfx/cmfx/relationship"
)

// Group 提供了对现有用户进行过滤的方法
type Group interface {
	// Users 返回当前分组下的用户 ID
	Users() ([]int64, error)
}

type Module struct {
	types *tag.Module // 类型

	// 通知与用户的关联表
	//
	// v0 表示通知的 ID，v1 表示用户的 ID。
	groups *relationship.Module[int64, int64]
}

// Load 加载模块
func Load(mod *cmfx.Module) *Module {
	m := &Module{
		types:  tag.Load(mod, typesKey),
		groups: relationship.Load[int64, int64](mod, mod.ID()+"_notice_group"),
	}

	return m
}

// Types 通知类型操作接口
func (m *Module) Types() *tag.Module { return m.types }

func (m *Module) Groups() *tag.Module { return m.groups }
