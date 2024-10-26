// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/app/options/route';
import { Pages } from '@/pages/pages';
import { default as Permission } from './permission';
import { default as Roles } from './roles';
import { default as Selector } from './selector';

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
            { type: 'item', icon: 'groups', label: '_i.page.roles.roles', path: this.#prefix },
        ];
    }
}
