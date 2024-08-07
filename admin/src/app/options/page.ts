// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

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
    icon?: string;

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
}
