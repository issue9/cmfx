// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Pages } from '@/pages/pages';
import { MenuItem, Route } from '@/app';
import { default as Home } from './home';
import { default as Settings } from './settings';
import { default as Logout } from './logout';
import { default as Login } from './login';
import { default as SecurityLogs } from './securitylogs';

/**
 * 提供了与当前登录用户直接相关的页面
 */
export class current implements Pages {
    /**
     * 提供当前用户的首页面板
     */
    static Home = Home;

    /**
     * 提供当前用户的设置面
     */
    static Settings = Settings;

    /**
     * 登录页面
     */
    static Login = Login;

    /**
     * 退出页面
     */
    static Logout = Logout;

    /**
     * 用户的安全日志
     */
    static SecurityLogs = SecurityLogs;

    readonly #prefix: string;

    static build(prefix: string) {
        return new current(prefix);
    }

    private constructor(prefix: string) {
        this.#prefix = prefix;
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component:Home },
            { path: this.#prefix + '/settings', component: Settings },
            { path: this.#prefix + '/securitylogs', component: SecurityLogs },
            { path: this.#prefix + '/logout', component: Logout },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', label: '_i.page.current.home', path: this.#prefix, icon: 'home' },
            { type: 'item', label: '_i.page.current.settings', path: this.#prefix + '/settings', icon: 'settings' },
            { type: 'item', label: '_i.page.current.securitylog', path: this.#prefix + '/securitylogs', icon: 'badge' },
            { type: 'divider' },
            { type: 'item', label: '_i.page.current.logout', path: this.#prefix + '/logout', icon: 'logout' },
        ];
    }
}