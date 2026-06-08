// SPDX-FileCopyrightText: 2026 caixw
//
// SPDX-License-Identifier: MIT

import type { Layout } from '@components/base';

export const labelAlignments = ['start', 'center', 'end'] as const;

export type LabelAlignment = (typeof labelAlignments)[number];

/**
 * Form 和 Field 共有的属性
 */
export interface CommonProps {
	/**
	 * 表单组件的 layout 属性的默认值
	 *
	 * @remarks 同时也影响整个 Form 组件的布局。
	 * @reactive
	 * @defaultValue 'horizontal'
	 */
	layout?: Layout;

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
	labelAlign?: LabelAlignment;

	/**
	 * 是否显示表单项组件中帮助信息和错误信息
	 *
	 * @reactive
	 */
	feedback?: boolean;
}
