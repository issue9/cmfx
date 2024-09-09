// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { default as APIs } from './apis';
import { default as Services } from './services';
import { default as Info } from './info';
import { Pages } from '@/pages/pages';
import { MenuItem, Route } from '@/app/options/route';

export class system implements Pages {
    static APIs = APIs;
    static Services = Services;
    static Info = Info;

    readonly #prefix: string;

    static build(prefix: string) {
        return new system(prefix);
    }


    private constructor(p: string) {
        this.#prefix = p;
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix+'/apis', component: APIs },
            { path: this.#prefix+'/services', component: Services },
            { path: this.#prefix+'/info', component: Info },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', label: '_i.page.system.apis', path: this.#prefix+'/apis' },
            { type: 'item', label: '_i.page.system.services', path: this.#prefix+'/services' },
            { type: 'item', label: '_i.page.system.info', path: this.#prefix+'/info' },
        ];
    }
}