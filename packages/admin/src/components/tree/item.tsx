// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

/**
 * 列表项
 */
export type Item = {
    type: 'divider';
} | {
    type: 'group'; // 分组

    label: string;

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
     * {@link container.ts/Props#onChange} 的参数即为此值。
     *
     * NOTE: 该值为空时，{@link Item#items} 不能为空。
     */
    value?: string;

    /**
     * 子项
     *
     * NOTE: 该值为空时，{@link Item#value} 不能为空。
     */
    items?: Array<Item>;

    /**
     * 列表项的展示内容
     */
    label: JSX.Element;

    /**
     * 是否禁用该项
     */
    disabled?: boolean;
};

/**
* 从 items 中查找值为 value 的项
* @param items 被查找对象
* @param value 查找的对象
* @returns 如果找到了，返回 value 在 items 的索引值，如果嵌套层，则返回每一次的索引。
*/
export function findItems(items: Array<Item>, value?: string): Array<number>|undefined {
    if (value === undefined) {
        return;
    }

    for(const [index,item] of items.entries()) {
        switch (item.type) {
        case 'group':
            if (item.items && item.items.length > 0) {
                const indexes = findItems(item.items, value);
                if (indexes && indexes.length > 0) {
                    return [index, ...indexes];
                }
            }
            continue;
        case 'item':
            if (item.items && item.items.length > 0) {
                const indexes = findItems(item.items, value);
                if (indexes && indexes.length > 0) {
                    return [index, ...indexes];
                }
            } else if (item.value === value) {
                return [index];
            }
        }
    }
}
