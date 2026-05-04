// SPDX-FileCopyrightText: 2025-2026 caixw
//
// SPDX-License-Identifier: MIT

import type { JSX } from 'solid-js';

import type { Layout } from '@components/base';

/**
 * 子组件所处的位置
 */
export interface Area {
	/**
	 * 指定位置
	 */
	pos:
		| 'top-start'
		| 'top-center'
		| 'top-end'
		| 'middle-start'
		| 'middle-center'
		| 'middle-end'
		| 'bottom-start'
		| 'bottom-center'
		| 'bottom-end';

	/**
	 * 向后跨的列数
	 */
	cols?: 1 | 2 | 3;

	/**
	 * 向下跨的行数
	 */
	rows?: 1 | 2 | 3;
}

export interface Areas {
	help: Area;
	label: Area;
	input: Area;
	extra: Area;
}

/**
 * 将 {@link Area} 转换为 CSS 样式
 */
export function area2Style(area: Area): JSX.CSSProperties {
	return {
		'grid-area': area.pos,
		'grid-column-end': area.cols ? `span ${area.cols}` : undefined,
		'grid-row-end': area.rows ? `span ${area.rows}` : undefined,
	};
}

/**
 * 根据布局 l 生成通用的各个字段位置
 *
 * @param l - 布局方式；
 */
export function calcAreas(l: Layout): Areas {
	// NOTE: grid 中如果一个列或是行，即使其宽或是高度为 0，gap 也不会消失，
	// 所以得根据 layout 计算位置并填充多余的列。

	return l === 'horizontal'
		? {
				label: { pos: 'top-start', rows: 2 }, // label 只需要与 input 横向对齐，所以 rows 应该保持与 input 一样。
				input: { pos: 'top-center', cols: 2, rows: 2 },
				help: { pos: 'bottom-center' },
				extra: { pos: 'bottom-end' },
			}
		: {
				label: { pos: 'top-start', cols: 2 },
				input: { pos: 'middle-start', cols: 3 },
				help: { pos: 'bottom-start', cols: 3 },
				extra: { pos: 'top-end' },
			};
}
