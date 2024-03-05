// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

// Package rbac 简单的 RBAC 权限规则实现
package rbac

import (
	"fmt"

	"github.com/issue9/orm/v5"
	"github.com/issue9/orm/v5/sqlbuilder"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"

	"github.com/issue9/cmfx"
)

// RBAC 权限管理类
type RBAC struct {
	super int64 // 超级用户 ID，无视所有的角色规则。

	roles     map[int64]*Role
	users     map[int64][]int64 // 键名为用户 ID，键值为与该用户关联的角色 ID。
	resources []string
	groups    map[string]*Group
	mod       cmfx.Module
}

// New 声明 RBAC 对象
//
// mod 拥有此对象的模块；
func New(mod cmfx.Module) (*RBAC, error) {
	roles := make([]*role, 0, 50)
	e := mod.DBEngine(nil)
	if _, err := e.Where("1=1").Select(true, &roles); err != nil {
		return nil, web.NewStackError(err)
	}

	rbac := &RBAC{
		roles:     make(map[int64]*Role, len(roles)),
		users:     make(map[int64][]int64, 100),
		resources: make([]string, 0, 100),
		groups:    make(map[string]*Group, 10),
		mod:       mod,
	}

	for _, r := range roles {
		rbac.roles[r.ID] = &Role{r: r, rbac: rbac}
	}

	links := make([]*link, 0, 5)
	size, err := e.Where("role=0").Select(true, &links)
	if err != nil {
		return nil, err
	}
	if size > 1 {
		return nil, web.NewStackError(fmt.Errorf("数据库中存在多于一个的超级管理员 %v", links))
	}
	if size == 1 {
		rbac.super = links[0].UID
	}

	return rbac, nil
}

// Link 将 uid 与角色进行关联
func (rbac *RBAC) Link(tx *orm.Tx, uid int64, role ...int64) error {
	if len(role) == 0 {
		return nil
	}

	role = sliceutil.Unique(role, func(i, j int64) bool { return i == j })

	// 提取未在 uid 角色列表中的角色
	if u := rbac.users[uid]; len(u) > 0 {
		rs := make([]int64, 0, len(role))
		for _, item := range role {
			if sliceutil.Count(u, func(i int64, _ int) bool { return i == item }) <= 0 {
				rs = append(rs, item)
			}
		}
		role = rs
	}

	for _, r := range role {
		if _, found := rbac.roles[r]; !found {
			return web.NewLocaleError("role %d not found", r)
		}
	}

	if len(role) > 0 {
		// 由以上代码保证给出的 role 不会有重复数据， 也不会有已存在于数据库。
		rbac.users[uid] = append(rbac.users[uid], role...)

		ps := make([]orm.TableNamer, 0, len(role))
		for _, rid := range role {
			ps = append(ps, &link{UID: uid, Role: rid})
		}

		return rbac.mod.DBEngine(tx).InsertMany(100, ps...)
	}

	return nil
}

// Unlink 取消 uid 与 role 的关联
func (rbac *RBAC) Unlink(tx *orm.Tx, uid int64, roleID ...int64) error {
	if len(roleID) == 0 {
		return nil
	}

	roleID = sliceutil.Unique(roleID, func(i, j int64) bool { return i == j })
	for _, r := range roleID {
		if _, found := rbac.roles[r]; !found {
			return web.NewLocaleError("role %d not found", r)
		}
	}

	if len(roleID) > 0 {
		roles := make([]any, 0, len(roleID))
		for _, v := range roleID {
			roles = append(roles, v)
		}
		e := rbac.mod.DBEngine(tx)
		if _, err := e.Where("uid=?", uid).AndIn("role", roles...).Delete(&link{}); err != nil {
			return err
		}
	}

	roles := rbac.users[uid]
	rbac.users[uid] = sliceutil.QuickDelete(roles, func(i int64, _ int) bool {
		for _, r := range roleID {
			if r == i {
				return true
			}
		}
		return false
	})

	return nil
}

func (rbac *RBAC) isAllow(uid int64, resID string) (allowed bool, err error) {
	if rbac.IsSuper(uid) {
		return true, nil
	}

	roles, found := rbac.users[uid]
	if !found {
		links := make([]*link, 0, 5)
		e := rbac.mod.DBEngine(nil)
		if _, err := e.Where("uid=?", uid).And("role<>0").Select(true, &links); err != nil {
			return false, err
		}

		roles = make([]int64, 0, len(links))
		for _, l := range links {
			roles = append(roles, l.Role)
		}

		rbac.users[uid] = roles
	}

	for _, rid := range roles {
		role := rbac.roles[rid]
		if sliceutil.Exists(role.r.Resources, func(i string, _ int) bool { return i == resID }) {
			rbac.mod.Server().Logs().DEBUG().Printf("用户 %d 因为角色 %d 拥有了访问资源 %s 的权限", uid, rid, resID)
			return true, nil
		}
	}
	return false, nil
}

// IsAllowRoles 是否允许 uid 将角色 rs 赋予其它用户
//
// 只能应用自己当前角色或是从当前角色继承的子角色赋予其它用户。
func (rbac *RBAC) IsAllowRoles(uid int64, rs []int64) (bool, error) {
	roles, found := rbac.users[uid]
	if !found {
		return false, nil
	}

LOOP:
	for _, rr := range rs {
		for _, r := range roles {
			if rbac.Role(r).hasChild(rr) {
				continue LOOP
			}
		}
		return false, nil
	}

	return true, nil
}

// SetSuper 更换超级管理员
func (rbac *RBAC) SetSuper(tx *orm.Tx, uid int64) error {
	e := rbac.mod.DBEngine(tx)

	// 删除原有的，可能不存在
	if _, err := e.Where("role=0").Delete(&link{}); err != nil {
		return err
	}

	if _, err := e.Insert(&link{UID: uid}); err != nil {
		return err
	}

	rbac.super = uid
	return nil
}

// IsSuper 是否为超级管理员
func (rbac *RBAC) IsSuper(uid int64) bool { return rbac.super > 0 && rbac.super == uid }

func (m *RBAC) LeftJoin(sql *sqlbuilder.SelectStmt, alias, on string, roles []int64) {
	sql.Column(alias + ".role")
	sql.Join("left", m.mod.DBPrefix().TableName(&link{}), alias, on).WhereStmt().AndIn("role", sliceutil.AnySlice(roles)...)
}
