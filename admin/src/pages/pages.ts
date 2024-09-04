// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { MenuItem, Route } from '@/app/options/route';

/**
 * 定义一个页面集合需要提供的接口
 */
export interface Pages {
    /**
     * 该页面集合中的所有路由定义
     */
    routes(): Array<Route>;

    /**
     * 该页面集合中需要出现在左侧菜单栏中的菜单列表
     */
    menus(): Array<MenuItem>;
}
