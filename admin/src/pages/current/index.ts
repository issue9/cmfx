// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/app';
import { Pages } from '@/pages/pages';
import { default as Dashboard } from './dashboard';
import { default as Login } from './login';
import { default as Logout } from './logout';
import { default as Profile } from './profile';
import { default as SecurityLogs } from './securitylogs';
import { default as Settings } from './settings';

/**
 * 提供了与当前登录用户直接相关的页面
 */
export class current implements Pages {
    /**
     * 提供当前用户的仪表盘
     */
    static Dashboard = Dashboard;

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
     * 当前用户的个人信息面板
     */
    static Profile = Profile;

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
            { path: this.#prefix + '/dashboard', component:Dashboard },
            { path: this.#prefix + '/profile', component:Profile },
            { path: this.#prefix + '/settings', component: Settings },
            { path: this.#prefix + '/securitylogs', component: SecurityLogs },
            { path: this.#prefix + '/logout', component: Logout },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', label: '_i.page.current.dashboard', path: this.#prefix + '/dashboard', icon: 'dashboard' },
            { type: 'item', label: '_i.page.current.profile', path: this.#prefix + '/profile', icon: 'id_card' },
            { type: 'item', label: '_i.page.current.settings', path: this.#prefix + '/settings', icon: 'settings' },
            { type: 'item', label: '_i.page.current.securitylog', path: this.#prefix + '/securitylogs', icon: 'security' },
            { type: 'divider' },
            { type: 'item', label: '_i.page.current.logout', path: this.#prefix + '/logout', icon: 'logout' },
        ];
    }
}
