// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package rbac

import (
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
)

// Role 角色信息
type Role struct {
	r    *role
	rbac *RBAC
}

// UserRoles 用户关联的角色表
func (rbac *RBAC) UserRoles(uid int64) []int64 { return rbac.users[uid] }

// Role 返回角色的相关数据
//
// 如果不存在，则返回 nil。
func (rbac *RBAC) Role(id int64) *Role {
	r, found := rbac.roles[id]
	if !found {
		return nil
	}
	return r
}

// NewRole 声明新的角色
//
// parent 表示父角色，如果从父角色继承，那么可分配的资源也只能是父角色拥有的资源；
func (rbac *RBAC) NewRole(parent int64, name, desc string) (int64, error) {
	if parent > 0 && rbac.roles[parent] == nil {
		return 0, web.NewLocaleError("父角色 %d 不存在", parent)
	}

	e := rbac.mod.DBEngine(nil)
	g := &role{Parent: parent, Name: name, Description: desc}
	id, err := e.LastInsertID(g)
	if err != nil {
		return 0, err
	}

	rbac.roles[id] = &Role{
		r: &role{
			ID:          id,
			Name:        name,
			Description: desc,
			Parent:      parent,
		},
		rbac: rbac,
	}

	return id, nil
}

// 删除角色
func (rbac *RBAC) deleteRole(id int64) error {
	if _, found := rbac.roles[id]; !found {
		return nil
	}

	for _, role := range rbac.roles {
		if role.r.Parent == id {
			return web.NewLocaleError("角色 %d 是角色 %d 的父类，不能删除", id, role.r.ID)
		}
	}

	for u, roles := range rbac.users {
		if sliceutil.Count(roles, func(i int64, _ int) bool { return i == id }) > 0 {
			return web.NewLocaleError("角色还包含了用户 %d，不能被删除！", u)
		}
	}

	if _, err := rbac.mod.DBEngine(nil).Delete(&role{ID: id}); err != nil {
		return err
	}

	delete(rbac.roles, id)

	return nil
}

// 更新角色信息
func (r *Role) update(name, desc string) error {
	e := r.rbac.mod.DBEngine(nil)
	if _, err := e.Update(&role{ID: r.r.ID, Name: name, Description: desc}); err != nil {
		return err
	}
	r.r.Name = name
	r.r.Description = desc
	return nil
}

// 设置角色 role 访问 resID，覆盖原来的可访问资源
func (r *Role) set(res ...string) error {
	if len(res) > 0 {
		res = sliceutil.Unique(res, func(i, j string) bool { return i == j })      // 过滤重复值
		res = sliceutil.Delete(res, func(i string, _ int) bool { return i == "" }) // 删除空值
	}
	if len(res) == 0 {
		return nil
	}

	// 如果存在父角色，还要确认父角色(仅限直系)是不是包含了这些资源。
	if r.r.Parent > 0 {
		p := r.rbac.roles[r.r.Parent]
		if p == nil {
			return web.NewLocaleError("rbac: 未找到 %d 的父角色 %d", r.r.ID, r.r.Parent)
		}

		if len(p.r.Resources) == 0 {
			return web.NewLocaleError("rbac: 请先设置父角色 %d 的资源", p.r.ID)
		}

		if !sliceutil.Contains(p.r.Resources, res, func(i, j string) bool { return i == j }) {
			return web.NewLocaleError("rbac: 角色 %d 只能继承父角色 %d 的资源", r.r.ID, r.r.Parent)
		}
	}

	r.r.Resources = res

	e := r.rbac.mod.DBEngine(nil)
	_, err := e.Update(&role{ID: r.r.ID, Resources: r.r.Resources}, "resources")
	return err
}

// 检测 child 是否继承自 r
func (r *Role) hasChild(child int64) bool {
	if child == 0 {
		return false
	}

	if child == r.r.ID {
		return true
	}

	c := r.rbac.roles[child]
	if c == nil || c.r.Parent == 0 {
		return false
	}
	return r.hasChild(c.r.Parent)
}

// 角色可分配的资源列表
func (r *Role) resources() []string {
	if r.r.Parent == 0 {
		res := make([]string, 0, len(r.rbac.resources))
		res = append(res, r.rbac.resources...)
		return res
	}

	// 如果有父角色(限于直系)，那么它所能分配的资源只能是父角色已经拥有的。
	//
	// 角色拥有的资源从上到下是逐渐收紧的状态，
	// 所以一个角色所能支配的资源只能是其直系父角色带来的。
	if parent := r.rbac.Role(r.r.Parent); parent != nil {
		return parent.r.Resources
	}
	return nil
}

func (rbac *RBAC) RoleExists(v int64) bool {
	_, found := rbac.roles[v]
	return found
}
