// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import type { Form } from '@components/form';

export type Accessor = Form.FieldAccessor<string | undefined>;

/**
 * 定义了颜色空间需要实现的接口
 */
export interface ColorSpace {
	/**
	 * 表示当前拾取框的唯一 ID
	 */
	id: string;

	/**
	 * 表示当前拾取框的翻译 ID
	 */
	localeID: string;

	/**
	 * 判定给定的值是否属于当前的实例
	 *
	 * @remarks
	 * 可能存在多个实现都返回 true 的情况。
	 */
	include(value: string): boolean;

	/**
	 * 实现实例的面板
	 *
	 * @param s - 访问器函数，用于获取颜色值；
	 * @param parent - 父元素，用于计算颜色变量的真实值；
	 */
	panel(s: Accessor, parent: HTMLElement): JSX.Element;
}
