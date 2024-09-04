// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/app/options/route';
import { Pages } from '@/pages/pages';
import { default as Admins } from './admins';
import { default as Edit } from './edit';

export class admins implements Pages {
    static Admins = Admins;
    static Edit = Edit;

    #prefix: string;

    private constructor(prefix: string) {
        this.#prefix = prefix;
    }

    static build(prefix: string) {
        return new admins(prefix);
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component: ()=>Admins({routePrefix: this.#prefix}) },
            { path: this.#prefix + '/:id', component: Edit },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', label: '_i.page.admin.admin', path: this.#prefix },
        ];
    }

}
