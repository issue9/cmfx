// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { Component } from 'solid-js';

import { MenuItem, Route } from '@/app/options/route';
import { Pages } from '@/pages/pages';
import { ActionProps, default as Members } from './members';

export class members implements Pages {
    static Members = Members;
    
    readonly #prefix: string;
    readonly #memberActions?: Component<ActionProps>;

    private constructor(prefix: string, memActions?: Component<ActionProps>) {
        this.#prefix = prefix;
        this.#memberActions = memActions;
    }

    /**
     * 页面路由的统一前缀
     *
     * @param prefix 以 / 开头但是不能以 / 结尾；
     * @param memActions 列表页 Members 组件中，操作列的组件，用户可以在此添加一些额外的操作按钮；
     */
    static build(prefix: string, memActions?: Component<ActionProps>) {
        return new members(prefix, memActions);
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component: ()=>Members({routePrefix: this.#prefix, actions: this.#memberActions}) },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', icon: 'group', label: '_i.page.member.member', path: this.#prefix },
        ];
    }
}