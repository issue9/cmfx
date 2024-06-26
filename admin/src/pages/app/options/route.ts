// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

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
     * 该分组下的默认首页
     *
     * 必须真实存在于 routes 之中。
     */
    home: string;

    /**
     * 该分组下的所有路由项
     */
    routes: Array<Route>;
}

interface Route {
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
};
