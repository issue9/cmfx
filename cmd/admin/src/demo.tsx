// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@cmfx/admin/components';
import { Pages } from '@cmfx/admin/pages';
import { routes } from '../../../admin/src/demo';

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
