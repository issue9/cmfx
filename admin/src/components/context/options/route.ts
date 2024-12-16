// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { RouteSectionProps } from '@solidjs/router';
import { Component } from 'solid-js';

import { IconSymbol } from '@/components';

/**
 * 对路由的定义
 *
 * public 和 private 中不能有相同的路由项，否则会导致无法正确导航。
 */
export interface Routes {
    /**
     * 不需要登录即可查看的页面
     */
    public: Group;

    /**
     * 需要登录才可查看的页面
     */
    private: Group;

    /**
     * 指定访问路径的别名
     *
     * 当用户访问 src 页面时，如果访问 dest 页面，但地址不会发生变化。
     * dest 页面必须存在于 {@link Routes#public.routes} 或是 {@link Routes#private.routes} 之中。
     */
    alias?: Array<{
        src: string;
        dest: string;
    }>;
}

interface Group {
    /**
     * 默认页
     */
    home: string;

    /**
     * 该分组下的所有路由项
     */
    routes: Array<Route>;
}

export interface Route {
    /**
     * 页面的路由地址
     */
    path?: string | Array<string>;

    /**
     * 页面对应的实际组件
     */
    component?: Component<RouteSectionProps>;

    /**
     * 子路由
     */
    children?: Array<Route>;
}

export type MenuItem = {
    type: 'divider';
} | {
    type: 'group';
    label: string;

    /**
     * 子菜单
     */
    items: Array<MenuItem>
} | {
    type: 'item';

    /**
     * 图标名称
     */
    icon?: IconSymbol;

    /**
     * 菜单的标题
     */
    label: string;

    /**
     * 路由的跳转路径，如果是分组项，此值为空。
     */
    path?: string

    /**
     * 快捷键
     *
     * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/accesskey
     */
    accesskey?: string;

    /**
     * 子菜单
     */
    items?: Array<MenuItem>
};