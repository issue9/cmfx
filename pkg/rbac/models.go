// SPDX-License-Identifier: MIT

package rbac

import (
	"html"

	"github.com/issue9/orm/v5/types"
)

type ResourcesType = types.SliceOf[string]

// 用户与角色的关联
type link struct {
	UID  int64 `orm:"name(uid);unique(uid_role)"`
	Role int64 `orm:"name(role);unique(uid_role)"`
}

type role struct {
	ID          int64         `orm:"name(id);ai"`
	Name        string        `orm:"name(name);unique(name);len(50)"`
	Description string        `orm:"name(description);len(-1)"`
	Parent      int64         `orm:"name(parent)"`
	Resources   ResourcesType `orm:"name(resources);len(-1)"` // 关联的资源 ID
}

func (l *link) TableName() string { return "_rbac_links" }

func (r *role) TableName() string { return "_rbac_roles" }

func (r *role) BeforeInsert() error {
	r.ID = 0
	r.Name = html.EscapeString(r.Name)
	r.Description = html.EscapeString(r.Description)
	return nil
}

func (r *role) BeforeUpdate() error {
	r.Name = html.EscapeString(r.Name)
	r.Description = html.EscapeString(r.Description)
	return nil
}
