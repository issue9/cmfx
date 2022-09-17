// SPDX-License-Identifier: MIT

// Package rbac 简单的 RBAC 权限规则实现
package rbac

import (
	"fmt"

	"github.com/issue9/orm/v5"
	"github.com/issue9/sliceutil"
	"github.com/issue9/web"
)

// RBAC 权限管理类
type RBAC struct {
	roles     map[int64]*Role
	users     map[int64][]int64 // 键名为用户 ID，键值为与该用户关联的角色 ID。
	resources map[string]web.LocaleStringer

	db           *orm.DB
	dbPrefix     orm.Prefix
	reasonLogger web.Logger
}

// New 声明 RBAC 对象
//
// parent 管理此对象的模块；
// db 数据库对象；
// reasonLogger 如果不为空，则在此日志上输出是因为什么理由获得了资源的访问权限；
func New(mod string, db *orm.DB, reasonLogger web.Logger) (*RBAC, error) {
	p := orm.Prefix(mod)

	roles := make([]*role, 0, 50)
	e := p.DB(db)
	if _, err := e.Where("1=1").Select(true, &roles); err != nil {
		return nil, err
	}

	rbac := &RBAC{
		roles:     make(map[int64]*Role, len(roles)),
		users:     make(map[int64][]int64, 100),
		resources: make(map[string]web.LocaleStringer, 100),

		db:           db,
		dbPrefix:     p,
		reasonLogger: reasonLogger,
	}

	for _, r := range roles {
		rbac.roles[r.ID] = &Role{r: r, rbac: rbac}
	}

	return rbac, nil
}

// Link 将 uid 与角色进行关联
func (rbac *RBAC) Link(tx *orm.Tx, uid int64, role ...int64) error {
	if len(role) == 0 {
		return nil
	}

	role = sliceutil.Unique(role, func(i, j int64) bool { return i == j })

	// 提取未在当前用户的角色列表中的
	if u := rbac.users[uid]; len(u) > 0 {
		rs := make([]int64, 0, len(role))
		for _, item := range role {
			if sliceutil.Count(u, func(i int64) bool { return i == item }) <= 0 {
				rs = append(rs, item)
			}
		}
		role = rs
	}

	for _, r := range role {
		if _, found := rbac.roles[r]; !found {
			return fmt.Errorf("角色 %d 并不存在", r)
		}
	}

	if len(role) > 0 {
		// 由以上代码保证给出的 role 不会有重复数据， 也不会有已存在于数据库。
		rbac.users[uid] = append(rbac.users[uid], role...)

		ps := make([]orm.TableNamer, 0, len(role))
		for _, rid := range role {
			ps = append(ps, &link{UID: uid, Role: rid})
		}

		e := rbac.dbPrefix.Tx(tx)
		if err := e.InsertMany(100, ps...); err != nil {
			return err
		}
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
			return fmt.Errorf("角色 %d 并不存在", r)
		}
	}

	if len(roleID) > 0 {
		roles := make([]any, 0, len(roleID))
		for _, v := range roleID {
			roles = append(roles, v)
		}
		e := rbac.dbPrefix.Tx(tx)
		if _, err := e.Where("uid=?", uid).AndIn("role", roles...).Delete(&link{}); err != nil {
			return err
		}
	}

	roles := rbac.users[uid]
	rbac.users[uid] = sliceutil.QuickDelete(roles, func(i int64) bool {
		for _, r := range roleID {
			if r == i {
				return true
			}
		}
		return false
	})

	return nil
}

// IsAllow 查询 uid 是否拥有访问 resID 的权限
func (rbac *RBAC) IsAllow(uid int64, resID string) (allowed bool, err error) {
	roles, found := rbac.users[uid]
	if !found {
		links := make([]*link, 0, 5)
		e := rbac.dbPrefix.DB(rbac.db)
		if _, err := e.Where("uid=?", uid).Select(true, &links); err != nil {
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
		if sliceutil.Exists(role.r.Resources, func(i string) bool { return i == resID }) {
			if rbac.reasonLogger != nil {
				rbac.reasonLogger.Printf("用户 %d 因角色 %d 获得了访问 %s 的权限", uid, rid, resID)
			}
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
