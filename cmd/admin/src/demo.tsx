// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@cmfx/admin/dev';
import { routes } from '@cmfx/admin/dev/demo';
import { Pages } from '@cmfx/admin/dev/pages';

export class Demo implements Pages {
    readonly #prefix: string;

    constructor(p: string) {
        this.#prefix = p;
    }

    routes(): Array<Route> {
        return [{ path: this.#prefix, children: routes }];
    }

    menus(): Array<MenuItem> {
        const menuItems: Array<MenuItem> = [];
        routes.sort().forEach((r) => {
            menuItems.push({
                type: 'item',
                label: r.path as string,
                path: this.#prefix + r.path
            });
        });

        return [{
            type: 'item',
            label: 'components',
            items: menuItems
        } as const];
    }
}
