// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Column as ExportColumn, presetCellRenderFunc } from '@cmfx/core';
import type { JSX } from 'solid-js';

/**
 * 用于描述列的信息
 *
 * @typeParam T - 表示的是展示在表格中的单条数据的类型。
 */
export interface Column<T extends object> extends ExportColumn<T> {
	/**
	 * 列标题
	 *
	 * @remarks
	 * 如果该值为空，则采用以下几种路径获取值：
	 *  - label
	 *  - id
	 *
	 * renderLabel 和 label 的区别在于，label 用于导出，只能是字符串，
	 * 而 renderLabel 可以是组件类型。
	 */
	renderLabel?: JSX.Element;

	/**
	 * `colgroup>col` 的 CSS 类名
	 */
	colClass?: string;

	/**
	 * 为 `thead>tr>td` 和 `thead>tr>th` 指定的 CSS 类。
	 */
	headClass?: string;

	/**
	 * 为每个单元格指定类型。包括表头和普通的数据单元。
	 *
	 * @remarks
	 * NOTE: 如果存在 {@link Column#headClass}，那么 cellClass 将不会对表头中的单元格起作用；
	 * NOTE: 不需要打印的列，可用 no-print 样式；
	 */
	cellClass?: string;

	/**
	 * 单元格内容的渲染
	 *
	 * @remarks
	 * 如果该值为空，则采用以下几种路径获取值：
	 *  - content
	 *  - T[id]
	 *
	 * renderContent 和 content 的区别在于，content 用于导出，只能是字符串，
	 * 而 renderContent 可以是组件类型。
	 */
	renderContent?: CellRenderFunc<T>;
}

/**
 * 渲染单元格的方法
 *
 * @param id - 对应当前列 {@link Column#id}；
 * @param val - 如果该 id 存在于 T 中，那返回其在 T 中的值，如果不存在则是 undefined；
 * @param obj - 表示是当前行的对象，其类型为 T；
 */
export type CellRenderFunc<T extends object> = <K extends keyof T>(
	id: string | K,
	val?: K extends keyof T ? T[K] : unknown,
	obj?: T,
) => JSX.Element;

/**
 * 对列定义进行预处理
 *
 * @remarks
 * 主要是对 renderContent 字段进行默认值设置以及查找是否存在列的 CSS 类定义。
 * @returns 处理后的列定义数组和是否存在指定 CSS 类的标志。
 */
export function preProcessColumns<T extends object>(
	columns: Array<Column<T>>,
	df: Intl.DateTimeFormat,
): [cols: Array<Omit<Column<T>, 'renderContent'> & { renderContent: CellRenderFunc<T> }>, hasClass: boolean] {
	let has = false;
	const cols = columns.map(col => {
		has = has || !!col.colClass;

		const content = col.content || presetCellRenderFunc;

		const render: CellRenderFunc<T> = (id, val, obj) => {
			const ret = content(id, val, obj);
			if (ret instanceof Date) {
				return <time>{df.format(ret)}</time>;
			}
			return ret;
		};
		return {
			...col,
			content: content,
			renderContent: col.renderContent || render,
		};
	});

	return [cols, has];
}
