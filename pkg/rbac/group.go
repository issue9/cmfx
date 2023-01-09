// SPDX-License-Identifier: MIT

package rbac

import (
	"fmt"

	"github.com/issue9/web"
)

type Group struct {
	rbac      *RBAC
	id        string
	desc      web.LocaleStringer
	resources map[string]web.LocaleStringer
}

// Group 新建资源分组
func (rbac *RBAC) NewGroup(id string, desc web.LocaleStringer) *Group {
	if _, found := rbac.groups[id]; found {
		panic(fmt.Sprintf("已经存在同名的分组 %s", id))
	}

	g := &Group{
		rbac:      rbac,
		id:        id,
		desc:      desc,
		resources: make(map[string]web.LocaleStringer, 30),
	}
	rbac.groups[id] = g

	return g
}

func (rbac *RBAC) Group(id string) *Group { return rbac.groups[id] }

func (g *Group) addResource(id string, title web.LocaleStringer) *Group {
	resID := buildResourceID(g.id, id)
	if _, found := g.resources[resID]; found {
		panic(fmt.Sprintf("存在同名的资源 ID %s", id))
	}
	g.resources[resID] = title
	g.rbac.resources = append(g.rbac.resources, id)
	return g
}

// AddResources 注册多个资源
func (g *Group) AddResources(resources map[string]web.LocaleStringer) *Group {
	for id, title := range resources {
		g.addResource(id, title)
	}
	return g
}

// IsAllow 查询 uid 是否拥有访问 resID 的权限
func (g *Group) IsAllow(uid int64, resID string) (allowed bool, err error) {
	return g.rbac.isAllow(uid, buildResourceID(g.id, resID))
}

func buildResourceID(mod, res string) string { return mod + "_" + res }
