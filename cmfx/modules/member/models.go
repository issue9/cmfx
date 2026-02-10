// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

package member

import (
	"database/sql"
	"html"

	"github.com/issue9/cmfx/cmfx/types"
)

// 用户的基本信息
type infoPO struct {
	// 关联的用户 ID
	ID int64 `orm:"name(id);unique(id)" json:"id" cbor:"id" yaml:"id"`

	// 生日
	Birthday sql.NullTime `orm:"name(birthday);nullable" yaml:"birthday" json:"birthday" cbor:"birthday"`

	// 性别
	Sex types.Sex `orm:"name(sex)" json:"sex" cbor:"sex" yaml:"sex"`

	// 昵称
	Nickname string `orm:"name(nickname);len(50)" json:"nickname" cbor:"nickname" yaml:"nickname"`

	// 头像
	Avatar string `orm:"name(avatar);len(1000)" json:"avatar,omitempty" cbor:"avatar,omitempty" yaml:"avatar,omitempty"`

	// 邀请人的 ID
	Inviter int64 `orm:"name(inviter)" json:"inviter,omitempty" yaml:"inviter,omitempty" cbor:"inviter,omitempty"`

	// 会员等级，如无必要，可设置为 0
	Level int64 `orm:"name(level);default(0)" json:"level" yaml:"level" cbor:"level"`

	// 用户的类型，如无必要，可设置为 0
	Type int64 `orm:"name(type);default(0)" json:"type" yaml:"type" cbor:"type"`
}

func (*infoPO) TableName() string { return `_info` }

func (a *infoPO) BeforeInsert() error {
	a.Nickname = html.EscapeString(a.Nickname)
	return nil
}

// BeforeUpdate 更新之前需要执行的操作
func (a *infoPO) BeforeUpdate() error {
	a.Nickname = html.EscapeString(a.Nickname)
	return nil
}
