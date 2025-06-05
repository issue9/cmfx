// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import IconGroups from '~icons/material-symbols/groups';

import { MenuItem, Route } from '@/options';
import { Pages } from '@/pages/pages';
import { Permission } from './permission';
import { Roles } from './roles';
import { Selector } from './selector';

/**
 * 提供所有角色相关的功能
 */
export class roles implements Pages {
    /**
     * 角色权限编辑组件
     */
    static Permission = Permission;

    /**
     * 角色列表组件
     */
    static Roles = Roles;

    /**
     * 角色选择框
     */
    static Selector = Selector;

    readonly #prefix: string;

    private constructor(prefix: string) {
        this.#prefix = prefix;
    }

    static build(prefix: string): Pages {
        return new roles(prefix);
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component: ()=>Roles({routePrefix: this.#prefix}) },
            { path: this.#prefix + '/:id/permission', component: Permission },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', icon: IconGroups, label: '_p.roles.roles', path: this.#prefix },
        ];
    }
}
