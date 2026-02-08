// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { presetCellRenderFunc } from '@cmfx/core';
import { For, JSX, Show } from 'solid-js';

import { joinClass, RefProps } from '@components/base';
import { useLocale } from '@components/context';
import { Empty } from '@components/result';
import { Spin, SpinRef } from '@components/spin';
import { CellRenderFunc, Column } from './column';
import styles from './style.module.css';
import { Table, Props as TableProps, Ref as TableRef } from './table';

export interface Ref {
	/**
	 * 组件根元素
	 */
	root(): SpinRef<'div'>;

	/**
	 * 组件中的表格元素
	 */
	table(): TableRef;
}

export interface Props<T extends object> extends Omit<TableProps, 'ref'>, RefProps<Ref> {
	/**
	 * 是否加载状态
	 *
	 * @reactive
	 */
	loading?: boolean;

	/**
	 * 列的定义
	 */
	columns: Array<Column<T>>;

	/**
	 * 表格的数据
	 *
	 * @reactive
	 */
	items?: Array<T>;

	/**
	 * 固定表格头部位于指定的位置
	 *
	 * @remarks 如果为 undefined，表示不固定，其它值表示离顶部的距离。
	 *
	 * @reactive
	 */
	stickyHeader?: string;

	/**
	 * 表格顶部的扩展空间
	 *
	 * NOTE: 该区域不属于 table 空间。
	 *
	 * @reactive
	 */
	extraHeader?: JSX.Element;

	/**
	 * 表格底部的扩展空间
	 *
	 * NOTE: 该区域不属于 table 空间。
	 *
	 * @reactive
	 */
	extraFooter?: JSX.Element;
}

/**
 * 基础的表格组件
 */
export function BasicTable<T extends object>(props: Props<T>) {
	const l = useLocale();
	const df = l.datetimeFormat();
	let tableRef: TableRef;

	const hasCol = props.columns.findIndex(v => !!v.colClass) >= 0;

	const cols: Array<Omit<Column<T>, 'renderContent'> & { renderContent: CellRenderFunc<T> }> = props.columns.map(
		col => {
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
		},
	);

	return (
		<Spin
			tag="div"
			spinning={props.loading}
			palette={props.palette}
			style={props.style}
			class={joinClass(undefined, styles.table, props.class)}
			ref={el => {
				if (props.ref) {
					props.ref({
						root: () => el,
						table: () => tableRef,
					});
				}
			}}
		>
			<Show when={props.extraHeader}>
				{c => {
					return c();
				}}
			</Show>

			<Table
				fixedLayout={props.fixedLayout}
				hoverable={props.hoverable}
				striped={props.striped}
				ref={el => {
					tableRef = el;
				}}
			>
				<Show when={hasCol}>
					<colgroup>
						<For each={cols}>{item => <col class={item.colClass} />}</For>
					</colgroup>
				</Show>

				<thead
					style={{
						position: props.stickyHeader === undefined ? undefined : 'sticky',
						top: props.stickyHeader === undefined ? undefined : props.stickyHeader,
					}}
				>
					<tr>
						<For each={cols}>
							{item => (
								<th class={item.headClass ?? item.cellClass}>{item.renderLabel ?? item.label ?? item.id.toString()}</th>
							)}
						</For>
					</tr>
				</thead>

				<tbody>
					<Show when={props.items && props.items.length > 0}>
						<For each={props.items}>
							{row => (
								<tr>
									<For each={cols}>
										{h => {
											const cell = h.id in row ? row[h.id as keyof T] : undefined;
											return (
												<td class={h.cellClass}>
													{h.renderContent(h.id, cell as Parameters<CellRenderFunc<T>>[1], row)}
												</td>
											);
										}}
									</For>
								</tr>
							)}
						</For>
					</Show>
					<Show when={!props.items || props.items.length === 0}>
						<tr>
							<td colSpan={props.columns.length}>
								<Empty palette={props.palette}>{l.t('_c.table.nodata')}</Empty>
							</td>
						</tr>
					</Show>
				</tbody>
			</Table>

			<Show when={props.extraFooter}>
				{c => {
					return c();
				}}
			</Show>
		</Spin>
	);
}
