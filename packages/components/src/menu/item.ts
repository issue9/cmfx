// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX } from 'solid-js';

import { AvailableEnumType, classList } from '@/base';
import { IconComponent } from '@/icon';

/**
 * 菜单项
 */
export type MenuItem = TypeDivider | TypeGroup | TypeItem;

export interface TypeDivider {
    type: 'divider';
}

export interface TypeGroup {
    type: 'group'; // 分组

    label: JSX.Element;

    /**
     * 分组的子项
     */
    items: Array<MenuItem>;
}

export interface TypeItem {
    type: 'item'; // 默认的子项

    /**
     * 表示当前项的唯一值
     *
     * NOTE: 该值为空时，{@link MenuItem#items} 不能为空。
     */
    value?: AvailableEnumType;

    /**
     * 子项
     *
     * NOTE: 该值为空时，{@link MenuItem#value} 不能为空。
     */
    items?: Array<MenuItem>;

    /**
     * 菜单项的内容
     */
    label: JSX.Element;

    /**
     * 图标
     */
    icon?: IconComponent;

    /**
     * 菜单项尾部的内容
     */
    suffix?: JSX.Element

    /**
     * 是否禁用该项
     */
    disabled?: boolean;

    /**
     * 快捷键
     */
    hotkey?: Hotkey;
}

type RenderTypeItem = Omit<TypeItem, 'disabled'> & {
    class?: string;
    level: number;
    selected?: boolean;
};

type RenderMenuItem = TypeDivider | TypeGroup | RenderTypeItem;

/**
 * 生成易于渲染的菜单项数据，主要是根据参数生成了 CSS 样式。
 *
 * @param items 菜单项数据；
 * @param level 当前菜单项的层级；
 * @param selectedCls 选中样式类名；
 * @param disabledCls 禁用样式类名；
 * @param selected 选中项的值，通过此值判断是否需要添加 selectedCls 样式；
 * @returns 返回两个值，第一个是易于渲染的菜单项数据，第二个表示参数 items 中是否有选中项。
 */
export function buildRenderItemType(
    items: Array<MenuItem>, level: number, selectedCls: string, disabledCls: string, selected?: AvailableEnumType
): [items: Array<RenderMenuItem>, hasSelected: boolean] {
    let has: boolean = false;

    const ret = items.map(item => {
        switch (item.type) {
        case 'divider':
            has = false;
            return item;
        case 'group':
            const [items1, hasSelected1] = buildRenderItemType(item.items, level, selectedCls, disabledCls, selected);
            has = hasSelected1;

            return { ...item, items: items1 };
        case 'item':
            const [items, hasSelected] = item.items
                ? buildRenderItemType(item.items, level + 1, selectedCls, disabledCls, selected)
                : [, item.value === selected];
            has ||= hasSelected;

            return {
                ...item,
                level,
                class: classList({
                    [disabledCls]: item.disabled,
                    [selectedCls]: hasSelected,
                }),
                items: items,
            };
        }
    });

    return [ret, has];
}
