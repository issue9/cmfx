// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { isPage, type Page, presetCellRenderFunc } from '@cmfx/core';
import { createSignal, For, type JSX, Show } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { useLocale } from '@components/context';
import { Empty } from '@components/result';
import { Spin } from '@components/spin';
import { Table } from '@components/table/table';
import type { CellRenderFunc, Column } from './column.ts';
import styles from './style.module.css';

export interface Ref<T extends object> extends BaseRef<Spin.RootRef<'div'>> {
	/**
	 * 组件中的表格元素
	 */
	table(): Table.RootRef;

	/**
	 * 当前页的内容
	 */
	current(): Array<T> | undefined;

	/**
	 * 刷新当前页的内容
	 */
	refresh(): Promise<void>;
}

/**
 * @typeParam T 表中每一行数据的类型；
 */
export interface Props<T extends object> extends Omit<Table.RootProps, 'ref'>, RefProps<Ref<T>> {
	/**
	 * 是否加载状态
	 *
	 * @reactive
	 */
	loading?: boolean;

	/**
	 * 列的定义
	 */
	readonly columns: Array<Column<T>>;

	/**
	 *
	 * 加载数据的方法
	 */
	readonly load: () => Promise<Page<T> | Array<T> | undefined>;

	/**
	 * 固定表格头部位于指定的位置
	 *
	 * @remarks
	 * 如果为 undefined，表示不固定，其它值表示离顶部的距离。
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
	header?: JSX.Element;

	/**
	 * 表格底部的扩展空间
	 *
	 * NOTE: 该区域不属于 table 空间。
	 *
	 * @reactive
	 */
	footer?: JSX.Element;
}

/**
 * 基础的表格组件
 */
export function Root<T extends object>(props: Props<T>) {
	const l = useLocale();
	const df = l.datetimeFormat();
	let tableRef: Table.RootRef;

	const hasCol = props.columns.findIndex(v => !!v.colClass) >= 0;

	// 将列定义处理为需要的类型
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

	const [items, setItems] = createSignal<Array<T>>([]);

	return (
		<Spin.Root
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
						current: () => items(),
						refresh: async () => {
							const data = await props.load();
							if (isPage(data)) {
								setItems(data.current);
							} else {
								setItems(data ?? []);
							}
						},
					});
				}
			}}
		>
			<Show when={props.header}>{c => c()}</Show>

			<Table.Root
				fixedLayout={props.fixedLayout}
				hoverable={props.hoverable}
				striped={props.striped}
				ref={el => (tableRef = el)}
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
					<Show when={items().length > 0}>
						<For each={items()}>
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
					<Show when={items().length === 0}>
						<tr>
							<td colSpan={props.columns.length}>
								<Empty.Root palette={props.palette}>{l.t('_c.table.nodata')}</Empty.Root>
							</td>
						</tr>
					</Show>
				</tbody>
			</Table.Root>

			<Show when={props.footer}>{c => c()}</Show>
		</Spin.Root>
	);
}
