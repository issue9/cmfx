// SPDX-FileCopyrightText: 2024 caixw
//
// SPDX-License-Identifier: MIT

import { JSX } from 'solid-js';

import { Scheme } from '@/components/base';

/**
 * 所有表单元素共有的属性
 */
export interface Props {
    scheme?: Scheme;
    label?: JSX.Element;
    disabled?: boolean;
    readonly?: boolean;
    title?: string;
}

/**
 * 定义了 radio、select 等选项类型中每个选择项的类型。
 *
 * T 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Option<T> = [T, JSX.Element];

/**
 * 选择项的数据类型
 */
export type Options<T> = Array<Option<T>>;
