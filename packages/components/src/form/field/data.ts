// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

/**
 * 用户需要实现的数据交换区域的组件属性
 */
export interface FormDataProps {
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
