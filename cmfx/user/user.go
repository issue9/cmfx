// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

// Package user 提供用户账号的相关功能
//
// user 提供了两种方式表示用户 ID：
//
//   - string 主要用于向公共区域展示的用户 ID；
//   - int64 内部使用的用户 ID，从 1 开始，由数据库自增列表示；
package user

// SpecialUserID 特殊的用户 ID
//
// 表示不真实存在于用户表中的用户 ID，比如 settings 由此值表示所有用户的默认设置对象。
const SpecialUserID = 0
