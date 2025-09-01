// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { IconComponent } from '@cmfx/components';
import { Hotkey } from '@cmfx/core';
import { RouteSectionProps } from '@solidjs/router';
import { Component } from 'solid-js';

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

    /**
     * 翻译 ID
     */
    label: string;

    /**
     * 子菜单
     */
    items: Array<MenuItem>;
} | {
    type: 'item';

    /**
     * 图标名称
     */
    icon?: IconComponent;

    /**
     * 菜单的标题的翻译 ID
     */
    label: string;

    /**
     * 路由的跳转路径，如果是分组项，此值为空。
     */
    path?: string;

    /**
     * 子菜单
     */
    items?: Array<MenuItem>;

    /**
     * 快捷键
     */
    hotkey?: Hotkey;

    suffix?: string | number;
};
