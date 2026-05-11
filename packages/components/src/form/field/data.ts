// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { ChangeFunc } from '@components/base';

/**
 * 表单项组件需要实现的数据交换区域的接口
 *
 * @typeParam T - 表单项的值类型；
 */
export interface ValueProps<T> {
	/**
	 * 表单组件的值
	 *
	 * @reactive
	 *
	 * @remarks
	 * 如果使用了 Form 组件，则该属性会覆盖由 useField 获取的值。
	 */
	value?: T;

	/**
	 * {@link value} 变化时的回调方法
	 */
	onChange?: ChangeFunc<T | undefined>;
}

/**
 * 用户需要实现的数据交换区域的组件属性
 *
 * @typeParam T - 表单项的值类型；
 */
export interface DataProps<T> extends ValueProps<T> {
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
	 * 表单组件的 rounded 属性的默认值
	 *
	 * @reactive
	 */
	rounded?: boolean;

	/**
	 * tabindex 属性
	 *
	 * @reactive
	 * @defaultValue 0
	 */
	tabindex?: number;
}
