// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import type { AvailableEnumType } from '@components/base';

/**
 * 定义了 radio、choice 等选项类型中每个选择项的类型。
 *
 * @typeParam K - 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Option<K extends AvailableEnumType = string> = {
	value: K;
	label: JSX.Element;
	disabled?: boolean;
};

/**
 * 选择项的数据类型
 *
 * @typeParam K - 表示的是选择项的值类型，要求唯一且可比较。
 */
export type Options<T extends AvailableEnumType = string> = Array<Option<T>>;
