// SPDX-License-Identifier: MIT

package rbac

import (
	"fmt"

	"github.com/issue9/web"
)

func (rbac *RBAC) registerResource(id string, title web.LocaleStringer) error {
	if _, found := rbac.resources[id]; found {
		return fmt.Errorf("资源 %s 已经存在", id)
	}

	rbac.resources[id] = title
	return nil
}

// RegisterResources 一次性注册多个资源
//
// module 表示资源 ID 的统一前缀值，一般为模块的 ID，用于区分不同模块下的 ID 相同的资源。
func (rbac *RBAC) RegisterResources(mod string, res map[string]web.LocaleStringer) error {
	for id, r := range res {
		if err := rbac.registerResource(buildResourceID(mod, id), r); err != nil {
			return err
		}
	}
	return nil
}

// 角色可分配的资源列表
func (r *Role) resources() []string {
	if r.r.Parent == 0 {
		res := make([]string, 0, len(r.rbac.resources))
		for k := range r.rbac.resources {
			res = append(res, k)
		}
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

func buildResourceID(mod, res string) string { return mod + "_" + res }
