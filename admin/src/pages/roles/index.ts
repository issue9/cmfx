// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/app/options/route';
import { Pages } from '@/pages/pages';
import { default as Permission } from './permission';
import { default as Roles } from './roles';

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
            { type: 'item', label: '_i.page.roles.roles', path: this.#prefix },
        ];
    }
}
