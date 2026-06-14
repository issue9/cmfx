// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Column as ExportColumn, noPrint, presetCellRenderFunc } from '@cmfx/core';
import { createMemo, type JSX } from 'solid-js';
import { createStore, type Store } from 'solid-js/store';

import { Checkbox } from '@components/checkbox';
import { type Context, useTableContext } from './context';

/**
 * 用于描述列的信息
 *
 * @typeParam T - 表示的是展示在表格中的单条数据的类型。
 */
export interface DataTableColumn<T extends object> extends ExportColumn<T> {
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
	renderLabel?: JSX.Element | (() => JSX.Element);

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
	 * NOTE: 如果存在 {@link DataTableColumn#headClass}，那么 cellClass 将不会对表头中的单元格起作用；
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
 * @param id - 对应当前列 {@link DataTableColumn#id}；
 * @param val - 如果该 id 存在于 T 中，那返回其在 T 中的值，如果不存在则是 undefined；
 * @param row - 表示是当前行的对象；
 */
export type CellRenderFunc<T extends object> = (row: T, val?: T[keyof T], id?: keyof T) => JSX.Element;

export type PreProcessColumn<T extends object> = Omit<DataTableColumn<T>, 'renderContent' | 'renderLabel'> & {
	renderContent: CellRenderFunc<T>;
	renderLabel: () => JSX.Element;
};

/**
 * 对列定义进行预处理
 *
 * @remarks
 * 主要是对 renderContent 字段进行默认值设置以及查找是否存在列的 CSS 类定义。
 * @returns 处理后的列定义数组和是否存在指定 CSS 类的标志。
 */
export function preProcessColumns<T extends object>(
	columns: Array<DataTableColumn<T>>,
	df: Intl.DateTimeFormat,
): [cols: Array<PreProcessColumn<T>>, hasClass: boolean] {
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

		const renderLabel =
			typeof col.renderLabel === 'function'
				? col.renderLabel
				: (): JSX.Element => {
						return (col.renderLabel as JSX.Element) ?? (typeof col.label === 'function' ? col.label() : col.label);
					};

		return {
			...col,
			renderLabel,
			content: content,
			renderContent: col.renderContent || render,
		};
	});

	return [cols, has];
}

/**
 * 为数据表创建一个用于选择行的列
 *
 * @param key 列的键名，需要该列具有唯一性；
 * @returns 列定义和选择中的行由 key 值组成的数组；
 */
export function selectionColumn<T extends object>(key: keyof T): [col: DataTableColumn<T>, Store<Array<T[keyof T]>>] {
	const [sel, setSel] = createStore<Array<T[keyof T]>>([]);

	const col = {
		id: key,
		isUnexported: true,
		cellClass: noPrint,

		label: '',
		renderLabel: () => {
			const ctx = useTableContext() as Context<T>;
			const keys = createMemo(() => {
				return ctx.current?.map(item => item[key]);
			});

			return (
				<Checkbox
					checked={keys()?.length === sel.length}
					indeterminate={sel.length > 0 && sel.length < (keys()?.length ?? 0)}
					onChange={chk => {
						if (chk) {
							setSel(keys() as Array<T[keyof T]>);
						} else {
							setSel([]);
						}
					}}
				/>
			);
		},

		renderContent: ((_, val: T[keyof T]) => {
			return (
				<Checkbox
					checked={val && sel.includes(val)}
					onChange={chk => {
						if (chk) {
							setSel(sel.length, val);
						} else {
							setSel(prev => prev.filter(v => v !== val));
						}
					}}
				/>
			);
		}) as DataTableColumn<T>['renderContent'],
	} satisfies DataTableColumn<T>;

	return [col, sel];
}
