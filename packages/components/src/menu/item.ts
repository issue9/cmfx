// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX } from 'solid-js';

import { AvailableEnumType } from '@/base';
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

export type RenderTypeItem = TypeItem & {
    level: number;
    items?: Array<RenderMenuItem>;
};

type RenderTypeGroup = Omit<TypeGroup, 'items'> & {
    items: Array<RenderMenuItem>;
};

/**
 * 经过处理后可直接用于渲染的菜单项
 */
export type RenderMenuItem = TypeDivider | RenderTypeGroup | RenderTypeItem;

/**
 * 生成易于渲染的菜单项数据，主要是根据参数生成了 CSS 样式。
 *
 * @param items - 菜单项数据；
 * @param level - 当前菜单项的层级；
 */
export function buildRenderItemType(items: Array<MenuItem>, level: number): Array<RenderMenuItem> {
    return items.map(item => {
        switch (item.type) {
        case 'divider':
            return item;
        case 'group':
            return { ...item, items: buildRenderItemType(item.items, level) };
        case 'item':
            return {
                ...item,
                level,
                items: item.items ? buildRenderItemType(item.items, level + 1) : undefined,
            };
        }
    });
}
