// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

export interface Page {
    /**
     * 登录页面的地址
     */
    login: string

    /**
     * 登录之后的默认首页
     */
    home: string

    /**
     * 左侧的导航菜单
     */
    menus: Array<MenuItem>

    /**
     * 底部的导航链接
     */
    footer?: Array<MenuItem>
}

export interface MenuItem {
    /**
     * 图标名称
     */
    icon?: string

    /**
     * 菜单的标题
     */
    title: string

    /**
     * 路由的跳转路径，如果是分组项，此值为空。
     */
    key?: string

    /**
     * 子菜单
     */
    items?: Array<MenuItem>
}

export function checkPage(p: Page) {
    if (!p.login) {
        throw 'page.login 不能为空';
    }

    if (!p.home) {
        throw 'page.home 不能为空';
    }

    if (p.login === p.home) {
        throw 'login 与 home 不能相同';
    }

    checkMenus([], p.menus);

    if (p.footer) {
        checkMenus([], p.footer);
    }
}

/**
 * 检测 items 是否存在相同的的 path
 * @param keys 缓存的所有 MenuItems.Key 值
 * @param items 需要检测的对象
 */
export function checkMenus(keys: Array<string>, items: Array<MenuItem>) {
    for (const item of items) {
        if (item.title.length === 0) {
            throw 'title 不能为空';
        }

        if (keys.find((v) => { return v == item.key; })) {
            throw `存在同名的 key: ${item.key}`;
        }

        if (item.key) {
            keys.push(item.key);
        }

        if (item.items && item.items.length > 0) {
            checkMenus(keys, item.items);
        }
    }
}
