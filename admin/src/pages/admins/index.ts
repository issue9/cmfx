// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/components/context';
import { Pages } from '@/pages/pages';
import { Admins } from './admins';
import { Edit } from './edit';
import { New } from './new';

export class admins implements Pages {
    static Admins = Admins;
    static Edit = Edit;
    static New = New;

    readonly #prefix: string;

    private constructor(prefix: string) {
        this.#prefix = prefix;
    }

    static build(prefix: string) {
        return new admins(prefix);
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component: () => Admins({ routePrefix: this.#prefix }) },
            { path: this.#prefix + '/0', component: () => New({ backURL: this.#prefix }) },
            { path: this.#prefix + '/:id', component: () => Edit({ backURL: this.#prefix }) },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', icon: 'manage_accounts', label: '_i.page.admin.admin', path: this.#prefix },
        ];
    }
}
