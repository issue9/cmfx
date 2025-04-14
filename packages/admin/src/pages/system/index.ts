// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@admin/components';
import { Pages } from '@admin/pages/pages';
import { APIs } from './apis';
import { Info } from './info';
import { Services } from './services';

/**
 * 提供系统相关的功能
 */
export class system implements Pages {
    /**
     * API 页面
     */
    static APIs = APIs;

    /**
     * 系统服务页面
     */
    static Services = Services;

    /**
     * 系统信息
     */
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
