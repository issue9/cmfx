// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Options } from 'admin/dev';
import { routes } from 'admin/dev/demo';

export { routes } from 'admin/dev/demo';

const menuItems: Options['menus'] = [];
routes.forEach((r) => {
    menuItems.push({
        type: 'item',
        label: r.path as string,
        path: '/demo' + r.path
    });
});

export const menus: Options['menus'][number] = {
    type: 'item',
    label: 'components',
    items: menuItems
} as const;
