// SPDX-FileCopyrightText: 2024-2025 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { AvailableEnumType, BaseProps, Layout } from '@/base';

/**
 * 组件 Field 的属性
 */
export interface Props extends BaseProps {
    /**
     * 鼠标提示内容
     */
    title?: string;
}

export const labelAlignments = ['start', 'center', 'end'] as const;

export type LabelAlignment = typeof labelAlignments[number];

/**
 * Field 和 Form 共有的属性
 */
export interface CommonProps {
    /**
     * 禁用组件
     *
     * @reactive
     */
    disabled?: boolean;

    /**
     * 只读属性
     *
     * @reactive
     */
    readonly?: boolean;

    /**
     * 表单组件的 layout 属性的默认值
     *
     * @remarks 同时也影响整个 Form 组件的布局。
     * @reactive
     * @defaultValue 'horizontal'
     */
    layout?: Layout;

    /**
     * 表单组件的 hasHelp 属性的默认值
     *
     * @reactive
     * @defaultValue true
     */
    hasHelp?: boolean;

    /**
     * 表单组件的 rounded 属性的默认值
     *
     * @reactive
     */
    rounded?: boolean;

    /**
     * 表单组件中 label 宽度的默认值
     *
     * @reactive
     */
    labelWidth?: string;

    /**
     * 表单组件中 label 的对齐方式
     *
     * @remarks
     * 只有在 label 有明确宽度的情况下该属性才有效，比如设置了一个比较宽的 {@link labelWidth}。
     *
     * @reactive
     * @defaultValue layout === 'horizontal' ? 'end' : 'start'
     */
    labelAlign?: 'start' | 'center' | 'end';
}

/**
 * 所有表单元素共有的属性
 */
export type FieldBaseProps = Props & CommonProps & {
    tabindex?: number;

    label?: JSX.Element;

    /**
     * 提示信息
     *
     * 该内容显示在 helpArea 区别，只有 {@link FieldBaseProps#hasHelp} 为真时才会显示。
     */
    help?: JSX.Element;
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
