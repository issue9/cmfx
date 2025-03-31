// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/components';
import { Pages } from '@/pages/pages';
import { APIs } from './apis';
import { Info } from './info';
import { Services } from './services';

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
            { type: 'item', icon: 'api', label: '_i.page.system.apis', path: this.#prefix+'/apis' },
            { type: 'item', icon: 'settings_slow_motion', label: '_i.page.system.services', path: this.#prefix+'/services' },
            { type: 'item', icon: 'help', label: '_i.page.system.info', path: this.#prefix+'/info' },
        ];
    }
}
