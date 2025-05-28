// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Component, JSX } from 'solid-js';

import { MenuItem, Route } from '@/options';
import { Pages } from '@/pages/pages';
import { Dashboard } from './dashboard';
import { Login, Props as LoginProps } from './login';
import { Logout } from './logout';
import { MemStatistic } from './memstatistic';
import { components, PassportComponents } from './passports';
import { Profile } from './profile';
import { SecurityLogs } from './securitylogs';
import { Settings } from './settings';

/**
 * 提供了与当前登录用户直接相关的页面
 */
export class current implements Pages {
    static #passports: Map<string, PassportComponents> = components;
    
    /**
     * 会员统计信息面板
     */
    static MemberStatisticPanel = MemStatistic;

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
    static Login = (props: Omit<LoginProps, 'passports'>): JSX.Element => {
        return <Login {...props} passports={current.#passports} />;
    };

    /**
     * 退出页面
     */
    static Logout = Logout;

    /**
     * 当前用户的个人信息面板
     */
    static Profile = (): JSX.Element => {
        return <Profile passports={current.#passports} />;
    };

    /**
     * 用户的安全日志
     */
    static SecurityLogs = SecurityLogs;

    readonly #prefix: string;
    readonly #dashboardChildren?: Component<{}>;

    /**
     * 初始化登录方式的组件
     */
    static initPassports(p: Map<string, PassportComponents|string>) {
        const c = components;
        p.forEach((v, k) => {
            if (typeof v === 'string') {
                v = c.get(v)!;
            }
            c.set(k, v);
        });

        current.#passports = c;
    }

    /**
     * 生成 {@link Pages} 对象
     *
     * @param prefix 路由前缀
     * @param dashboardChildren 仪表盘内的组件
     */
    static build(prefix: string, dashboardChildren?: Component<{}>) {
        return new current(prefix, dashboardChildren);
    }

    private constructor(prefix: string, dashboardChild?: Component<{}>) {
        this.#prefix = prefix;
        this.#dashboardChildren = dashboardChild;
    }

    /**
     * 提供了除登录页之外的所有路由
     */
    routes(): Array<Route> {
        return [
            { path: this.#prefix + '/dashboard', component: () => <Dashboard>{this.#dashboardChildren!({})}</Dashboard> },
            { path: this.#prefix + '/profile', component: current.Profile },
            { path: this.#prefix + '/settings', component: Settings },
            { path: this.#prefix + '/securitylogs', component: SecurityLogs },
            { path: this.#prefix + '/logout', component: Logout },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', label: '_p.current.dashboard', path: this.#prefix + '/dashboard', icon: 'dashboard' },
            { type: 'item', label: '_p.current.profile', path: this.#prefix + '/profile', icon: 'id_card' },
            { type: 'item', label: '_p.current.settings', path: this.#prefix + '/settings', icon: 'settings' },
            { type: 'item', label: '_p.current.securitylog', path: this.#prefix + '/securitylogs', icon: 'security' },
            { type: 'divider' },
            { type: 'item', label: '_p.current.logout', path: this.#prefix + '/logout', icon: 'logout' },
        ];
    }
}
