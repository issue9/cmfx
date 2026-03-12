// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Exporter, FlattenKeys, Page, printElement, Query } from '@cmfx/core';
import { useSearchParams } from '@solidjs/router';
import { createResource, createSignal, JSX, mergeProps, Show, splitProps } from 'solid-js';
import IconExcel from '~icons/icon-park-twotone/excel';
import IconCSV from '~icons/material-symbols/csv';
import IconODS from '~icons/material-symbols/ods';
import IconPrint from '~icons/material-symbols/print';
import IconRefresh from '~icons/material-symbols/refresh';
import IconReset from '~icons/material-symbols/restart-alt';
import IconTableRows from '~icons/material-symbols/table-rows-narrow';

import type { Palette, RefProps } from '@components/base';
import { Button, SplitButton, ToggleButton } from '@components/button';
import { useLocale, useOptions } from '@components/context';
import { xprompt } from '@components/dialog';
import { Divider } from '@components/divider';
import { Checkbox, ObjectAccessor, Radio } from '@components/form';
import { Label } from '@components/label';
import { Dropdown } from '@components/menu';
import { PaginationBar } from '@components/pagination';
import * as BasicTable from './basic.mod';
import { fromSearch, Params, saveSearch } from './search';
import styles from './style.module.css';

export interface Ref<T extends object> extends BasicTable.RootRef {
	/**
	 * 表格当前页的数据
	 */
	items(): Array<T> | undefined;

	/**
	 * 刷新表格中的数据
	 */
	refresh(): Promise<void>;
}

type OBP<T extends object> = Omit<BasicTable.RootProps<T>, 'items' | 'extraHeader' | 'extraFooter' | 'ref'>;
type BaseTableProps<T extends object, Q extends Query> = OBP<T> &
	RefProps<Ref<T>> & {
		/**
		 * 是否需要将参数反映在地址的查询参数中
		 */
		inSearch?: boolean;

		/**
		 * 下载的文件名
		 *
		 * @defaultValue 'download'
		 */
		filename?: string;

		/**
		 * 构建查询参数组件
		 *
		 * 可以为空，可能存在只有分页的情况。
		 *
		 * @reactive
		 */
		queryForm?: (oa: ObjectAccessor<Q>) => JSX.Element;

		/**
		 * 查询参数的默认值
		 *
		 * 如果没有查询参数可以使用 `{}` 代替。
		 *
		 * NOTE: 如果 {@link Props#inSearch} 为 true，那么地址中的参数将覆盖此参数中的相同名称的字段。
		 *
		 * @reactive
		 */
		queries: Q;

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

		/**
		 * 一些突出元素的主题色，默认值为 primary。
		 *
		 * @reactive
		 * @defaultValue 'primary'
		 */
		accentPalette?: Palette;
	};

export type Props<T extends object, Q extends Query> =
	| (BaseTableProps<T, Q> & {
			/**
			 * 加载数据的方法
			 */
			load: (q: Q) => Promise<Page<T> | undefined>;

			/**
			 * 数据是否分页展示
			 */
			paging: true;

			/**
			 * 可用的每页展示数量
			 *
			 * NOTE: 只有在 paging 为 true 时才会有效
			 */
			pageSizes?: Array<number>;

			/**
			 * 每一页的数量
			 *
			 * @reactive
			 * @defaultValue `Options.pageSize`
			 */
			pageSize?: number;
	  })
	| (BaseTableProps<T, Q> & {
			load: (q: Q) => Promise<Array<T> | undefined>;
			paging?: false;
	  });

/**
 * 基于加载方法加载数据的表格
 *
 * @typeParam T - 为数据中每一条数据的类型；
 * @typeParam Q - 为查询参数的类型；
 */
export function Root<T extends object, Q extends Query = Query>(props: Props<T, Q>) {
	const [, opt] = useOptions();
	const l = useLocale();
	let ref: BasicTable.RootRef;

	let load = props.load;
	props = mergeProps(
		{
			filename: 'download',
			accentPalette: 'primary' as Palette,
			pageSizes: opt.pageSizes,
			pageSize: opt.pageSize,
		},
		props,
	);

	const [searchG, searchS] = useSearchParams<Params<Q>>();
	if (props.inSearch) {
		props.queries = fromSearch(props.queries, searchG);

		load = (async (q: Q) => {
			const ret = await props.load(q);
			saveSearch(q, searchS);
			return ret;
		}) as Props<T, Q>['load'];
	}

	const queries = new ObjectAccessor<Q>(props.queries);
	const [total, setTotal] = createSignal<number>(100);

	const [items, { refetch }] = createResource(async () => {
		const q = await queries.object();
		if (!q) {
			return undefined;
		}

		const ret = await load(q);
		if (ret === undefined) {
			return undefined;
		} else if (Array.isArray(ret)) {
			return ret;
		} else {
			setTotal(ret.count);
			return ret.current;
		}
	});

	if (props.ref) {
		props.ref({
			items: () => {
				return items();
			},
			refresh: async () => {
				await refetch();
			},
			root: () => ref!.root(),
			table: () => ref!.table(),
		});
	}

	const exports = async (ext: Parameters<Exporter<T, Q>['export']>[1]) => {
		const e = new Exporter<T, Q>(props.columns);
		const qq = await queries.object();
		if (!qq) {
			return;
		}

		const q = { ...qq };
		delete q.size;
		delete q.page;

		await e.fetch(load, q);
		const filename = await xprompt(l.t('_c.table.downloadFilename'), props.filename);
		if (filename) {
			e.export(filename, ext, l.locale.language);
		}
	};

	let footer: JSX.Element | undefined;

	if (props.paging) {
		const page = queries.accessor<number>('page' as FlattenKeys<Q>);
		const size = queries.accessor<number>('size' as FlattenKeys<Q>);
		if (size.getValue() === 0) {
			size.setValue(props.pageSize!);
		}

		footer = (
			<PaginationBar.Root
				class={styles.footer}
				palette={props.accentPalette}
				onPageChange={async p => {
					page.setValue(p);
					await refetch();
				}}
				onSizeChange={async s => {
					size.setValue(s);
					await refetch();
				}}
				page={page.getValue()}
				size={size.getValue()}
				sizes={props.pageSizes}
				total={total()}
			/>
		);
	}

	const [hoverable, setHoverable] = createSignal(props.hoverable);
	const [striped, setStriped] = createSignal(props.striped);
	const [sticky, setSticky] = createSignal(props.stickyHeader);

	const header = (
		<header class={styles.header}>
			<Show when={props.queryForm}>
				<form class={styles.search}>
					{props.queryForm!(queries)}
					<div class={styles.actions}>
						<SplitButton.Root
							align="end"
							onChange={async v => {
								switch (v) {
									case 'reset':
										queries.reset();
										break;
									default:
										await exports(v);
								}
							}}
							items={[
								{
									type: 'item',
									value: '.csv',
									label: <Label.Root icon={<IconCSV />}>{l.t('_c.table.exportTo', { type: 'CSV' })}</Label.Root>,
								},
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
									value: 'reset',
									disabled: queries.isPreset(),
									label: <Label.Root icon={<IconReset />}>{l.t('_c.reset')}</Label.Root>,
								},
							]}
						>
							<Button.Root type="submit" palette="primary" onclick={async () => await refetch()}>
								{l.t('_c.search')}
							</Button.Root>
						</SplitButton.Root>
					</div>
				</form>
			</Show>

			<Show when={props.queryForm && (props.toolbar || props.systemToolbar)}>
				<Divider.Root padding="8px" />
			</Show>

			<Show when={props.toolbar || props.systemToolbar}>
				<div class={styles.toolbar}>
					{props.toolbar}
					<Show when={props.systemToolbar}>
						<div class={styles['system-toolbar']}>
							<Dropdown.Root
								trigger="hover"
								items={[
									{
										type: 'item',
										value: 'hoverable',
										label: <Checkbox.Root readonly label={l.t('_c.table.hoverable')} checked={hoverable()} />,
									},
									{ type: 'divider' },
									{
										type: 'item',
										value: 'sticky-header',
										label: (
											<Checkbox.Root readonly label={l.t('_c.table.stickyHeader')} checked={sticky() !== undefined} />
										),
									},
									{ type: 'divider' },
									{
										type: 'item',
										value: '0',
										label: (
											<Radio.Root
												name="striped"
												readonly
												value={0}
												checked={striped() === 0 || striped() === undefined}
												label={l.t('_c.table.noStriped')}
											/>
										),
									},
									{
										type: 'item',
										value: '2',
										label: (
											<Radio.Root
												name="striped"
												readonly
												value={2}
												checked={striped() === 2}
												label={l.t('_c.table.striped', { num: 2 })}
											/>
										),
									},
									{
										type: 'item',
										value: '3',
										label: (
											<Radio.Root
												name="striped"
												readonly
												value={3}
												checked={striped() === 3}
												label={l.t('_c.table.striped', { num: 3 })}
											/>
										),
									},
									{
										type: 'item',
										value: '4',
										label: (
											<Radio.Root
												name="striped"
												readonly
												value={4}
												checked={striped() === 4}
												label={l.t('_c.table.striped', { num: 4 })}
											/>
										),
									},
									{
										type: 'item',
										value: '5',
										label: (
											<Radio.Root
												name="striped"
												readonly
												value={5}
												checked={striped() === 5}
												label={l.t('_c.table.striped', { num: 5 })}
											/>
										),
									},
								]}
								onChange={v => {
									switch (v) {
										case 'hoverable':
											setHoverable(!hoverable());
											break;
										case 'sticky-header':
											setSticky(sticky() === undefined ? '0px' : undefined);
											break;
										case '0':
											setStriped(0);
											break;
										case '2':
											setStriped(2);
											break;
										case '3':
											setStriped(3);
											break;
										case '4':
											setStriped(4);
											break;
										case '5':
											setStriped(5);
											break;
									}
									return true;
								}}
							>
								<Button.Root square rounded kind="fill" palette="tertiary">
									<IconTableRows />
								</Button.Root>
							</Dropdown.Root>
							<Button.Root
								square
								rounded
								kind="fill"
								palette="tertiary"
								onclick={async () => await refetch()}
								aria-label={l.t('_c.refresh')}
								title={l.t('_c.refresh')}
							>
								<IconRefresh />
							</Button.Root>
							<ToggleButton.FitScreen
								square
								rounded
								kind="fill"
								palette="tertiary"
								container={ref!.root().root()}
								aria-title={l.t('_c.table.fitScreen')}
								title={l.t('_c.table.fitScreen')}
							/>
							<Button.Root
								rounded
								square
								kind="fill"
								palette="tertiary"
								aria-label={l.t('_c.print')}
								title={l.t('_c.print')}
								onclick={() => {
									const css =
										'table {border-collapse: collapse; width: 100%} tr{border-bottom: 1px solid black;} th,td {text-align: left}';
									printElement(ref.root().root().querySelector('table')!, css);
								}}
							>
								<IconPrint />
							</Button.Root>
						</div>
					</Show>
				</div>
			</Show>
		</header>
	);

	if (!props.paging) {
		const [_, basicProps] = splitProps(props, [
			'load',
			'queries',
			'queryForm',
			'toolbar',
			'systemToolbar',
			'accentPalette',
			'hoverable',
			'striped',
			'stickyHeader',
			'ref',
		]);
		return (
			<BasicTable.Root
				ref={el => {
					ref = el;
				}}
				stickyHeader={sticky()}
				striped={striped()}
				hoverable={hoverable()}
				loading={items.loading}
				items={items()!}
				{...basicProps}
				footer={footer}
				header={header}
			/>
		);
	}
	const [_, basicProps] = splitProps(props, [
		'load',
		'queries',
		'queryForm',
		'toolbar',
		'systemToolbar',
		'paging',
		'accentPalette',
		'pageSizes',
		'hoverable',
		'striped',
		'stickyHeader',
		'ref',
	]);
	return (
		<BasicTable.Root
			ref={el => {
				ref = el;
			}}
			stickyHeader={sticky()}
			striped={striped()}
			hoverable={hoverable()}
			loading={items.loading}
			items={items()!}
			{...basicProps}
			footer={footer}
			header={header}
		/>
	);
}
