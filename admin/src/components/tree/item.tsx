// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { ElementProp } from '../base';

export type Value = number | string;

/**
 * 列表项
 */
export type Item = {
    type: 'divider';
} | {
    type: 'group'; // 分组

    label?: ElementProp;

    /**
     * 分组的子项
     */
    items: Array<Item>;
} | {
    /**
     * 表示该项的类型
     */
    type: 'item';

    /**
     * 表示当前项的唯一值
     *
     * {@link List#onChange} 的参数即为此值。
     */
    value: Value;

    /**
     * 子项
     */
    items?: Array<Item>;

    /**
     * 列表项的内容
     */
    label: ElementProp;

    /**
     * 是否禁用该项
     */
    disabled?: boolean;

    /**
     * 快捷键
     * 
     * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/accesskey
     */
    accesskey?: string;
};
