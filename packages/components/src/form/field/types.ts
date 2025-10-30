// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { AvailableEnumType, BaseProps, Layout } from '@/base';

export interface Props extends BaseProps {
    title?: string;
    label?: JSX.Element;
}

/**
 * 所有表单元素共有的属性
 */
export type FieldBaseProps = Props & {
    disabled?: boolean;
    readonly?: boolean;
    tabindex?: number;

    /**
     * 提示信息
     *
     * 该内容显示在 helpArea 区别，只有 {@link FieldBaseProps#hasHelp} 为真时才会显示。
     */
    help?: JSX.Element;

    /**
     * 内容排版方式，一般会影响 label 与主体内容的排列。
     */
    layout?: Layout;

    /**
     * 组件是否为圆角
     */
    rounded?: boolean;

    /**
    * 是否预留帮助信息的区域，如果为否，那么 {@link FieldBaseProps#help} 和错误信息都将不会被显示。
    */
    hasHelp?: boolean;
};

/**
 * 定义了 radio、choice 等选项类型中每个选择项的类型。
 *
 * @typeParam K - 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Option<K extends AvailableEnumType> = {
    value: K;
    label: JSX.Element;
    disabled?: boolean;
};

/**
 * 选择项的数据类型
 *
 * @typeParam K - 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Options<T extends AvailableEnumType> = Array<Option<T>>;
