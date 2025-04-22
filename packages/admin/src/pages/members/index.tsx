// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Component } from 'solid-js';

import { MenuItem, Route } from '@/context';
import { Pages } from '@/pages/pages';
import { ActionProps, Members } from './members';
import { PanelProps, View } from './view';
export type { Member } from './types';

/**
 * 提供了会员管理页面以及组件
 */
export class members implements Pages {
    /**
     * 会员列表页面
     */
    static Members = Members;

    /**
     * 查看会员信息
     */
    static View = View;

    readonly #prefix: string;
    readonly #memberActions?: Component<ActionProps>;
    readonly #viewPanels?: Component<PanelProps>;

    private constructor(prefix: string, memActions?: Component<ActionProps>, viewPanels?: Component<PanelProps>) {
        this.#prefix = prefix;
        this.#memberActions = memActions;
        this.#viewPanels = viewPanels;
    }

    /**
     * 页面路由的统一前缀
     *
     * @param prefix 以 / 开头但是不能以 / 结尾；
     * @param memActions 列表页 Members 组件中，操作列的组件，用户可以在此添加一些额外的操作按钮；
     * @param viewPanels 查看详情页中的额外面板组件；
     */
    static build(prefix: string, memActions?: Component<ActionProps>, viewPanels?: Component<PanelProps>) {
        return new members(prefix, memActions, viewPanels);
    }

    routes(): Array<Route> {
        return [
            { path: this.#prefix, component: ()=>Members({routePrefix: this.#prefix, actions: this.#memberActions}) },
            { path: `${this.#prefix}/:id`, component: ()=><View panels={this.#viewPanels} /> },
        ];
    }

    menus(): Array<MenuItem> {
        return [
            { type: 'item', icon: 'group', label: '_i.page.member.member', path: this.#prefix },
        ];
    }
}