// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Hotkey } from '@cmfx/core';
import { JSX } from 'solid-js';

import { AvailableEnumType } from '@components/base';

/**
 * 菜单项
 */
export type MenuItem<T extends AvailableEnumType = string> = TypeDivider | TypeGroup<T> | TypeItem<T>;

// 分隔符
export interface TypeDivider {
    type: 'divider';
}

// 分组
export interface TypeGroup<T extends AvailableEnumType = string> {
    type: 'group';

    label: JSX.Element;

    /**
     * 分组的子项
     */
    items: Array<MenuItem<T>>;
}

export interface TypeItem<T extends AvailableEnumType = string> {
    /**
     * 表示普通的菜单项，如果为 a 表示这是一个链接。
     */
    type: 'item' | 'a';

    /**
     * 表示当前项的唯一值
     *
     * @remarks 该值为空时，{@link MenuItem#items} 不能为空，
     * 如果 {@link "type"} 为 a 时，当前值表示链接的地址。
     */
    value?: T;

    /**
     * 子项
     *
     * @remarks 该值为空时，{@link MenuItem#value} 不能为空。
     */
    items?: Array<MenuItem<T>>;

    /**
     * 菜单项的内容
     */
    label: JSX.Element;

    /**
     * 菜单项前置的内容
     */
    prefix?: JSX.Element;

    /**
     * 菜单项尾部的内容
     *
     * @remarks 当 {@link MenuItem#items} 不为空时，该值无效。
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

export type RenderTypeItem<T extends AvailableEnumType = string> = TypeItem<T> & {
    level: number;
    items?: Array<RenderMenuItem<T>>;
};

type RenderTypeGroup<T extends AvailableEnumType = string> = Omit<TypeGroup<T>, 'items'> & {
    items: Array<RenderMenuItem<T>>;
};

/**
 * 经过处理后可直接用于渲染的菜单项
 */
export type RenderMenuItem<T extends AvailableEnumType = string> = TypeDivider | RenderTypeGroup<T> | RenderTypeItem<T>;

/**
 * 生成易于渲染的菜单项数据，主要是根据参数生成了 CSS 样式。
 *
 * @param items - 菜单项数据；
 * @param level - 当前菜单项的层级；
 */
export function buildRenderItemType<T extends AvailableEnumType = string>(
    items: Array<MenuItem<T>>, level: number
): Array<RenderMenuItem<T>> {
    return items.map(item => {
        switch (item.type) {
        case 'divider':
            return item;
        case 'group':
            return { ...item, items: buildRenderItemType<T>(item.items, level) };
        case 'item':
        case 'a':
            return {
                ...item,
                level,
                items: item.items ? buildRenderItemType<T>(item.items, level + 1) : undefined,
            };
        }
    });
}
