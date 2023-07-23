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

// NewResource 添加一个新的资源
//
// id 表示资源的 ID；
// title 为对该资源的描述；
// 返回唯一的资源 ID，该值可用于各类接口查询中；
func (g *Group) NewResource(id string, title web.LocaleStringer) string {
	resID := buildResourceID(g.id, id)
	if _, found := g.resources[resID]; found {
		panic(fmt.Sprintf("存在同名的资源 ID %s", id))
	}
	g.resources[resID] = title
	g.rbac.resources = append(g.rbac.resources, id)

	return resID
}

// ID 资源组的 ID
func (g *Group) ID() string { return g.id }

func buildResourceID(gid, res string) string { return gid + "_" + res }
