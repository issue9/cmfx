// SPDX-FileCopyrightText: 2022-2024 caixw
//
// SPDX-License-Identifier: MIT

package rbac

import (
	"errors"
	"html"

	"github.com/issue9/orm/v6"
	"github.com/issue9/webuse/v7/middlewares/acl/rbac"

	"github.com/issue9/cmfx/cmfx"
	"github.com/issue9/cmfx/cmfx/types"
)

// 用户与角色的关联
type modelLink struct {
	UID  int64  `orm:"name(uid);unique(urg)"`
	Role string `orm:"name(role);len(50);unique(urg)"`
	GID  string `orm:"name(gid);len(20);unique(urg)"`
}

type modelRole struct {
	GID         string        `orm:"name(gid);len(20)"`
	ID          string        `orm:"name(id);unique(id);len(50)"`
	Name        string        `orm:"name(name);len(50)"`
	Description string        `orm:"name(description);len(-1)"`
	Parent      string        `orm:"name(parent);len(50)"`
	Resources   types.Strings `orm:"name(resources);len(-1)"` // 关联的资源 ID
}

type dbStore struct {
	mod *cmfx.Module
}

func newDBStore(mod *cmfx.Module) rbac.Store[int64] { return &dbStore{mod: mod} }

func (db *dbStore) Load(gid string) (map[string]*rbac.Role[int64], error) {
	e := db.mod.Engine(nil)

	roles := make([]*modelRole, 0, 100)
	size, err := e.Where("gid=?", gid).Select(true, &roles)
	if err != nil {
		return nil, err
	}

	links := make([]*modelLink, 0, 100)
	_, err = e.Where("gid=?", gid).Select(true, &links)
	if err != nil {
		return nil, err
	}

	rs := make(map[string]*rbac.Role[int64], size)
	for _, r := range roles {
		users := make([]int64, 0, 50)
		for _, l := range links {
			if l.Role == r.ID {
				users = append(users, l.UID)
			}
		}

		rs[r.ID] = &rbac.Role[int64]{
			ID:        r.ID,
			Parent:    r.Parent,
			Name:      r.Name,
			Desc:      r.Description,
			Resources: r.Resources,
			Users:     users,
		}
	}

	return rs, nil
}

func (db *dbStore) Del(gid, id string) error {
	tx, err := db.mod.DB().Begin()
	if err != nil {
		return err
	}
	e := db.mod.Engine(tx)

	if _, err = e.Delete(&modelRole{ID: id}); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if _, err = e.Where("role=? AND gid=?", id, gid).Delete(&modelLink{}); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	return tx.Commit()
}

func (db *dbStore) Set(gid string, r *rbac.Role[int64]) error {
	tx, err := db.mod.DB().Begin()
	if err != nil {
		return err
	}
	e := db.mod.Engine(tx)

	_, err = e.Update(&modelRole{
		GID:         gid,
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Desc,
		Parent:      r.Parent,
		Resources:   r.Resources,
	}, "parent", "resources")
	if err != nil {
		return errors.Join(err, tx.Rollback())
	}

	if _, err = e.Where("role=? and gid=?", r.ID, gid).Delete(&modelLink{}); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	links := make([]orm.TableNamer, 0, len(r.Users))
	for _, uid := range r.Users {
		links = append(links, &modelLink{UID: uid, Role: r.ID, GID: gid})
	}
	if err = e.InsertMany(10, links...); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	return tx.Commit()
}

func (db *dbStore) Add(gid string, r *rbac.Role[int64]) error {
	tx, err := db.mod.DB().Begin()
	if err != nil {
		return err
	}
	e := db.mod.Engine(tx)

	_, err = e.Insert(&modelRole{
		GID:         gid,
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Desc,
		Parent:      r.Parent,
		Resources:   r.Resources,
	})
	if err != nil {
		return errors.Join(err, tx.Rollback())
	}

	links := make([]orm.TableNamer, 0, len(r.Users))
	for _, uid := range r.Users {
		links = append(links, &modelLink{UID: uid, Role: r.ID, GID: gid})
	}
	if err = e.InsertMany(10, links...); err != nil {
		return errors.Join(err, tx.Rollback())
	}

	return tx.Commit()
}

func (l *modelLink) TableName() string { return "_rbac_links" }

func (r *modelRole) TableName() string { return "_rbac_roles" }

func (r *modelRole) BeforeInsert() error {
	r.Name = html.EscapeString(r.Name)
	r.Description = html.EscapeString(r.Description)
	return nil
}

func (r *modelRole) BeforeUpdate() error {
	r.Name = html.EscapeString(r.Name)
	r.Description = html.EscapeString(r.Description)
	return nil
}
