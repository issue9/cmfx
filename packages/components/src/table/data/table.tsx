// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Exporter, type FlattenKeys, isPage, type Page, type Query } from '@cmfx/core';
import { useSearchParams } from '@solidjs/router';
import { type Component, createResource, createSignal, For, type JSX, mergeProps, Show } from 'solid-js';
import IconExcel from '~icons/icon-park-twotone/excel';
import IconCSV from '~icons/material-symbols/csv';
import IconMarkdown from '~icons/material-symbols/markdown';
import IconODS from '~icons/material-symbols/ods';
import IconReset from '~icons/material-symbols/restart-alt';

import type { BaseProps, BaseRef, RefProps } from '@components/base';
import { joinClass } from '@components/base';
import { Button, SplitButton } from '@components/button';
import { useLocale, useOptions } from '@components/context';
import { Dialog } from '@components/dialog';
import { Divider } from '@components/divider';
import { Form } from '@components/form';
import { Label } from '@components/label';
import { PaginationBar } from '@components/pagination';
import { Empty } from '@components/result';
import { Spin } from '@components/spin';
import { Table } from '@components/table/table';
import { type CellRenderFunc, type Column, preProcessColumns } from './column';
import styles from './style.module.css';
import { Toolbar } from './toolbar';

export interface Ref extends BaseRef<HTMLDivElement> {
	/**
	 * 组件中的表格元素
	 */
	table(): Table.RootRef;

	/**
	 * 刷新当前页的内容
	 */
	refresh(): Promise<void>;
}

/**
 * 根据 T 生成其值类型为字符串的对象
 *
 * 该类型符合 {@link useSearchParams} 的类型参数。
 */
export type SearchParams<T extends Query> = Partial<Record<keyof T, string>>;

/**
 * {@link SearchParams} 与 {@link Query} 之间相互转换的接口
 */
export interface SearchConverter<Q extends Query> {
	/**
	 * 将地址栏中的参数转换为类型 Q
	 */
	toQuery(params: SearchParams<Q>): Q;

	/**
	 * 将类型 Q 转换为符合地址栏中的参数类型
	 */
	fromQuery(query: Q): SearchParams<Q>;
}

interface InternalProps<T extends object, Q extends Query> extends BaseProps, RefProps<Ref> {
	/**
	 * 列的定义
	 */
	readonly columns: Array<Column<T>>;

	readonly queryForm?: (api: Form.API<Q>, Field: Component<Form.FieldProps<Q>>) => JSX.Element;

	/**
	 * 是否将查询参数与地址栏中的参数作映射
	 */
	readonly inSearch?: SearchConverter<Q>;

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

interface PagingProps<T extends object, Q extends Query> extends InternalProps<T, Q> {
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

interface NoPagingProps<T extends object, Q extends Query> extends InternalProps<T, Q> {
	/**
	 * 加载数据的方法
	 */
	readonly load: (q: Q) => Promise<Array<T> | undefined>;

	/**
	 * 是否分页
	 */
	readonly paging?: false;
}

export type Props<T extends object, Q extends Query> = PagingProps<T, Q> | NoPagingProps<T, Q>;

type ExportType = (typeof Exporter.exts)[number];

/**
 * 基础的表格组件
 */
export function Root<T extends object, Q extends Query>(props: Props<T, Q>) {
	const [, opt] = useOptions();

	props = mergeProps(
		{
			filename: 'download',
			pageSizes: props.paging ? (opt.pageSizes ?? undefined) : undefined,
			pageSize: props.paging ? (opt.pageSize ?? undefined) : undefined,
		},
		props,
	);

	let tableRef: Table.RootRef;
	let rootRef: HTMLDivElement;

	const l = useLocale();
	const [cols, hasColClass] = preProcessColumns<T>(props.columns, l.datetimeFormat());

	// 必须要有一个大于 0 的 total，否则分页组件会报错
	const [total, setTotal] = createSignal<number>(props.paging ? props.pageSize! : 1);

	const hoverable = createSignal(false);
	const striped = createSignal<Table.RootProps['striped']>(0);
	const sticky = createSignal<boolean>(false);

	const [searchG, searchS] = useSearchParams<SearchParams<Q>>();
	const [F, Field, api] = Form.create<Q>({
		initValue: props.inSearch
			? props.inSearch.toQuery(searchG)
			: ({
					page: 1,
					size: props.paging ? (props.pageSize ?? opt.pageSize) : opt.pageSize,
				} as Q),
	});
	if (props.inSearch) {
		api.onChange(v => searchS(props.inSearch!.fromQuery(v)));
	}

	const exports = async (ext: ExportType) => {
		const e = new Exporter<T, Q>(props.columns);
		const qq = await api.validValue();
		if (!qq) {
			return;
		}

		const q = { ...qq };
		delete q.size;
		delete q.page;

		await e.fetch(props.load, q);
		const filename = await Dialog.prompt(l.t('_c.table.downloadFilename'), props.filename);
		if (filename) {
			await e.export(`${filename}${ext}`);
		}
	};

	const [items, { refetch }] = createResource(async () => {
		const q = await api.validValue();
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

	// 查询表单
	const QueryForm = (): JSX.Element => {
		return (
			<F class={styles.search}>
				{props.queryForm!(api, Field)}
				<div class={styles.actions}>
					<SplitButton.Root
						align="end"
						onChange={async v => {
							switch (v) {
								case 'reset':
									api.reset();
									break;
								default:
									await exports(v!);
							}
						}}
						items={[
							{
								type: 'item',
								value: '.xlsx',
								label: <Label.Root icon={<IconExcel />}>{l.t('_c.table.exportTo', { type: 'Excel' })}</Label.Root>,
							},
							{
								type: 'item',
								value: '.ods',
								label: <Label.Root icon={<IconODS />}>{l.t('_c.table.exportTo', { type: 'ODS' })}</Label.Root>,
							},
							{ type: 'divider' },
							{
								type: 'item',
								value: '.csv',
								label: <Label.Root icon={<IconCSV />}>{l.t('_c.table.exportTo', { type: 'CSV' })}</Label.Root>,
							},
							{
								type: 'item',
								value: '.md',
								label: (
									<Label.Root icon={<IconMarkdown />}>{l.t('_c.table.exportTo', { type: 'Markdown' })}</Label.Root>
								),
							},
							{ type: 'divider' },
							{
								type: 'item',
								value: 'reset',
								disabled: api.isPreset(),
								label: <Label.Root icon={<IconReset />}>{l.t('_c.reset')}</Label.Root>,
							},
						]}
					>
						<Button.Root type="submit" palette="primary" onclick={async () => await refetch()}>
							{l.t('_c.search')}
						</Button.Root>
					</SplitButton.Root>
				</div>
			</F>
		);
	};

	// 底部导航条
	const Footer = (): JSX.Element => {
		if (!props.paging) {
			return;
		}

		const page = api.createFieldAccessor<number>('page' as FlattenKeys<Q>);
		const size = api.createFieldAccessor<number>('size' as FlattenKeys<Q>);

		return (
			<PaginationBar.Root
				class={styles.footer}
				page={page.getValue() ?? 1}
				onPageChange={async p => {
					page.setValue(p);
					await refetch();
				}}
				size={size.getValue()}
				onSizeChange={async s => {
					size.setValue(s);
					await refetch();
				}}
				sizes={props.pageSizes!}
				total={total()}
			/>
		);
	};

	return (
		<Spin.Root
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
					});
				}
			}}
		>
			<Show when={props.toolbar || props.systemToolbar || props.queryForm}>
				<header class={styles.header}>
					<Show when={props.queryForm}>
						<QueryForm />
					</Show>
					<Show when={props.queryForm && (props.toolbar || props.systemToolbar)}>
						<Divider.Root padding="8px" />
					</Show>
					<Show when={props.toolbar || props.systemToolbar}>
						<Toolbar
							systemToolbar={props.systemToolbar}
							hoverable={hoverable}
							striped={striped}
							sticky={sticky}
							refresh={async () => {
								await refetch();
							}}
							root={() => rootRef}
						>
							{props.toolbar}
						</Toolbar>
					</Show>
				</header>
			</Show>

			<Table.Root
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
						<For each={cols}>
							{item => (
								<th class={item.headClass ?? item.cellClass}>{item.renderLabel ?? item.label ?? item.id.toString()}</th>
							)}
						</For>
					</tr>
				</thead>

				<tbody>
					<Show when={items}>
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
					<Show when={!items}>
						<tr>
							<td colSpan={props.columns.length}>
								<Empty.Root palette={props.palette}>{l.t('_c.table.nodata')}</Empty.Root>
							</td>
						</tr>
					</Show>
				</tbody>
			</Table.Root>

			<Show when={props.paging}>
				<Footer />
			</Show>
		</Spin.Root>
	);
}
