// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type Converter, isPage, type Page, type Query } from '@cmfx/core';
import { joinClass, type ThemeProps } from '@cmfx/themes';
import { useSearchParams } from '@solidjs/router';
import { createResource, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';

import type { BaseRef, RefProps } from '@components/base';
import { useLocale, useOptions } from '@components/context';
import { Divider } from '@components/divider';
import { Form } from '@components/form';
import { Empty } from '@components/result';
import { Spin } from '@components/spin';
import { Table } from '@components/table/table';
import { PageBar, QueryBar, Toolbar } from './bars';
import { type DataTableColumn, preProcessColumns } from './column';
import { type FormBuilder, Provider } from './context';
import styles from './style.module.css';

export interface DataTableRef<T extends object> extends BaseRef<HTMLDivElement> {
	/**
	 * 组件中的表格元素
	 */
	table(): Table.Ref;

	/**
	 * 刷新当前页的内容
	 */
	refresh(): Promise<void>;

	items(): Array<T>;
}

/**
 * 根据 T 生成其值类型为字符串的对象
 *
 * 该类型符合 {@link useSearchParams} 的类型参数。
 */
export type DataTableSearchParams<T extends Query> = Partial<Record<keyof T, string>>;

/**
 * {@link DataTableSearchParams} 与 {@link Query} 之间相互转换的接口
 */
export type DataTableSearchConverter<Q extends Query> = Converter<Q, DataTableSearchParams<Q>>;

interface Base<T extends object, Q extends Query> extends ThemeProps, RefProps<DataTableRef<T>> {
	/**
	 * 列的定义
	 */
	readonly columns: Array<DataTableColumn<T>>;

	readonly queryForm?: FormBuilder<Q>;

	/**
	 * 是否将查询参数与地址栏中的参数作映射
	 */
	readonly inSearch?: DataTableSearchConverter<Q>;

	/**
	 * 下载的文件名
	 *
	 * @defaultValue 'download'
	 */
	readonly filename?: string;

	/**
	 * 是否根据第一行数据或是 col 的定义固定列的宽度，这可以提升一些渲染性能，
	 * 但是可能会造成空间的巨大浪费。具体可查看：
	 * {@link https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout}
	 *
	 * @reactive
	 */
	fixedLayout?: boolean;

	/**
	 * 工具栏的内容
	 *
	 * 此属性提供的内容显示在左侧部分。工具栏右侧部分为框架自身提供的功能。
	 *
	 * @reactive
	 */
	toolbar?: JSX.Element;

	/**
	 * 是否需要展示框架自身提供的工具栏功能
	 *
	 * @reactive
	 */
	systemToolbar?: boolean;
}

export interface PagingProps<T extends object, Q extends Query> extends Base<T, Q> {
	/**
	 * 加载数据的方法
	 */
	readonly load: (q: Q) => Promise<Page<T> | undefined>;

	/**
	 * 每页显示的行数
	 *
	 * @defaultValue Options.pageSize
	 */
	readonly pageSize?: number;

	/**
	 * 每页显示的行数选项
	 *
	 * @defaultValue Options.pageSizes
	 */
	readonly pageSizes?: Array<number>;

	/**
	 * 是否分页
	 */
	readonly paging: true;
}

export interface NoPagingProps<T extends object, Q extends Query> extends Base<T, Q> {
	/**
	 * 加载数据的方法
	 */
	readonly load: (q: Q) => Promise<Array<T> | undefined>;

	/**
	 * 是否分页
	 */
	readonly paging?: false;
}

export type DataTableProps<T extends object, Q extends Query> = PagingProps<T, Q> | NoPagingProps<T, Q>;

/**
 * 基础的表格组件
 */
export function DataTable<T extends object, Q extends Query>(props: DataTableProps<T, Q>) {
	const [, opt] = useOptions();

	props = mergeProps(
		{
			filename: 'download',
			pageSizes: props.paging ? (opt.pageSizes ?? undefined) : undefined,
			pageSize: props.paging ? (opt.pageSize ?? undefined) : undefined,
		},
		props,
	);

	let tableRef: Table.Ref;
	let rootRef: HTMLDivElement;

	const l = useLocale();
	const [cols, hasColClass] = preProcessColumns<T>(props.columns, l.datetimeFormat());

	// 必须要有一个大于 0 的 total，否则分页组件会报错
	const [total, setTotal] = createSignal<number>(props.paging ? props.pageSize! : 1);

	const hoverable = createSignal(false);
	const striped = createSignal<Table.Props['striped']>(0);
	const sticky = createSignal<boolean>(false);

	const [searchG, searchS] = useSearchParams<DataTableSearchParams<Q>>();
	const form = Form.create<Q>({
		initValue: props.inSearch
			? props.inSearch.to(searchG)
			: ({
					page: 1,
					size: props.paging ? (props.pageSize ?? opt.pageSize) : opt.pageSize,
				} as Q),
	});
	if (props.inSearch) {
		form[2].onChange(v => searchS(props.inSearch!.from(v)));
	}

	const [items, { refetch }] = createResource(async () => {
		const q = await form[2].validValue();
		if (!q) {
			return undefined;
		}

		const data = await props.load(q);
		if (data === undefined) {
			return undefined;
		} else if (isPage(data)) {
			setTotal(data.count);
			return data.current;
		} else {
			setTotal(data?.length ?? undefined);
			return data;
		}
	});

	return (
		<Spin
			tag="div"
			spinning={items.loading}
			palette={props.palette}
			style={props.style}
			class={joinClass(undefined, styles.table, props.class)}
			ref={el => {
				rootRef = el.root();
				if (props.ref) {
					props.ref({
						root: () => el.root(),
						table: () => tableRef,
						refresh: async () => {
							await refetch();
						},
						items: () => items() ?? [],
					});
				}
			}}
		>
			<Provider
				form={form}
				hoverable={hoverable}
				striped={striped}
				sticky={sticky}
				root={() => rootRef}
				table={() => tableRef.root()}
				current={items()}
				refresh={async () => {
					await refetch();
				}}
				columns={cols}
				load={props.load}
				queryForm={props.queryForm}
				filename={props.filename}
				systemToolbar={props.systemToolbar}
				total={total()}
				pageSizes={props.paging ? props.pageSizes : undefined}
			>
				<Show when={props.toolbar || props.systemToolbar || props.queryForm}>
					<header class={styles.header}>
						<Show when={props.queryForm}>
							<QueryBar />
						</Show>
						<Show when={props.queryForm && (props.toolbar || props.systemToolbar)}>
							<Divider padding="8px" />
						</Show>
						<Show when={props.toolbar || props.systemToolbar}>
							<Toolbar>{props.toolbar}</Toolbar>
						</Show>
					</header>
				</Show>

				<Table
					fixedLayout={props.fixedLayout}
					hoverable={hoverable[0]()}
					striped={striped[0]()}
					ref={el => (tableRef = el)}
				>
					<Show when={hasColClass}>
						<colgroup>
							<For each={cols}>{item => <col class={item.colClass} />}</For>
						</colgroup>
					</Show>

					<thead
						style={{
							position: sticky[0]() ? 'sticky' : undefined,
							top: sticky[0]() ? '0px' : undefined,
						}}
					>
						<tr>
							<For each={cols}>{item => <th class={item.headClass ?? item.cellClass}>{item.renderLabel()}</th>}</For>
						</tr>
					</thead>

					<tbody>
						<Show when={items}>
							<For each={items()}>
								{row => (
									<tr>
										<For each={cols}>
											{h => {
												const cell = h.id ? row[h.id] : undefined;
												return <td class={h.cellClass}>{h.renderContent(row, cell, h.id)}</td>;
											}}
										</For>
									</tr>
								)}
							</For>
						</Show>
						<Show when={!items}>
							<tr>
								<td colSpan={props.columns.length}>
									<Empty palette={props.palette}>{l.t('_c.table.nodata')}</Empty>
								</td>
							</tr>
						</Show>
					</tbody>
				</Table>

				<Show when={props.paging}>
					<PageBar />
				</Show>
			</Provider>
		</Spin>
	);
}
