// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { VoidComponent } from 'solid-js';
import IconAPI from '~icons/material-symbols/api';
import IconHelp from '~icons/material-symbols/help';
import IconInfo from '~icons/material-symbols/page-info';
import IconSettings from '~icons/material-symbols/settings-slow-motion';


import { MenuItem, Route } from '@/options';
import { Pages } from '@/pages/pages';
import { About } from './about';
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
     * 关于页面
     */
    static About = About;

    /**
     * 系统信息
     */
    static Info = Info;

    readonly #prefix: string;
    readonly #about?: VoidComponent;

    /**
     * 构建 {@link system} 对象
     *
     * @param prefix 路由地址前缀；
     * @param about 关于页面的附加内容，如果是 undefined 表示不显示关于页面；
     */
    static build(prefix: string, about?: VoidComponent) {
        return new system(prefix, about);
    }

    private constructor(p: string, about?: VoidComponent) {
        this.#prefix = p;
        this.#about = about;
    }

    routes(): Array<Route> {
        const routes: Array<Route> = [
            { path: this.#prefix + '/apis', component: APIs },
            { path: this.#prefix + '/services', component: Services },
            { path: this.#prefix + '/info', component: Info },
        ];
        if (this.#about) {
            routes.push({ path: this.#prefix + '/about', component: () => About({ description: this.#about }) });
        }

        return routes;
    }

    menus(): Array<MenuItem> {
        const menus: Array<MenuItem> = [
            { type: 'item', icon: IconAPI, label: '_p.system.apis', path: this.#prefix + '/apis' },
            { type: 'item', icon: IconSettings, label: '_p.system.services', path: this.#prefix + '/services' },
            { type: 'item', icon: IconHelp, label: '_p.system.serverInfo', path: this.#prefix + '/info' },
        ];
        if (this.#about) {
            menus.push({ type: 'item', icon: IconInfo, label: '_p.system.about', path: this.#prefix + '/about' });
        }

        return menus;
    }
}
