// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Exporter, type FlattenKeys, type Query } from '@cmfx/core';
import { type JSX, type ParentProps, Show } from 'solid-js';
import IconExcel from '~icons/icon-park-twotone/excel';
import IconCSV from '~icons/material-symbols/csv';
import IconMarkdown from '~icons/material-symbols/markdown';
import IconODS from '~icons/material-symbols/ods';
import IconRefresh from '~icons/material-symbols/refresh';
import IconReset from '~icons/material-symbols/restart-alt';
import IconTableRows from '~icons/material-symbols/table-rows-narrow';

import { Button, PrintButton, SplitButton, ToggleButton } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { useLocale } from '@components/context';
import { Dialog } from '@components/dialog';
import { Label } from '@components/label';
import { Dropdown } from '@components/menu';
import { PaginationBar } from '@components/pagination';
import { Radio } from '@components/radio';
import { type Context, useTableContext } from './context';
import styles from './style.module.css';

type ExportType = (typeof Exporter.exts)[number];

/**
 * 查询工具栏
 */
export function QueryBar<T extends object, Q extends Query>(): JSX.Element {
	const l = useLocale();
	const ctx = useTableContext() as Context<T, Q>;
	const [F, Field, api] = ctx.form;

	const exports = async (ext: ExportType) => {
		const e = new Exporter<T, Q>(ctx.columns);
		const qq = await api.validValue();
		if (!qq) {
			return;
		}

		const q = { ...qq };
		delete q.size;
		delete q.page;

		await e.fetch(ctx.load, q);
		const filename = await Dialog.prompt(l.t('_c.table.downloadFilename'), ctx.filename);
		if (filename) {
			await e.export(`${filename}${ext}`);
		}
	};

	return (
		<F class={styles.search}>
			{ctx.queryForm!(api, Field)}
			<div class={styles.actions}>
				<SplitButton
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
							label: <Label icon={<IconExcel />}>{l.t('_c.table.exportTo', { type: 'Excel' })}</Label>,
						},
						{
							type: 'item',
							value: '.ods',
							label: <Label icon={<IconODS />}>{l.t('_c.table.exportTo', { type: 'ODS' })}</Label>,
						},
						{ type: 'divider' },
						{
							type: 'item',
							value: '.csv',
							label: <Label icon={<IconCSV />}>{l.t('_c.table.exportTo', { type: 'CSV' })}</Label>,
						},
						{
							type: 'item',
							value: '.md',
							label: <Label icon={<IconMarkdown />}>{l.t('_c.table.exportTo', { type: 'Markdown' })}</Label>,
						},
						{ type: 'divider' },
						{
							type: 'item',
							value: 'reset',
							disabled: api.isPreset(),
							label: <Label icon={<IconReset />}>{l.t('_c.reset')}</Label>,
						},
					]}
				>
					<Button type="submit" palette="primary" onclick={async () => await ctx.refresh()}>
						{l.t('_c.search')}
					</Button>
				</SplitButton>
			</div>
		</F>
	);
}

/**
 * 分页导航工具栏
 */
export function PageBar<T extends object, Q extends Query>(): JSX.Element {
	const ctx = useTableContext() as Context<T, Q>;
	const [, , api] = ctx.form;
	const page = api.createFieldAccessor<number>('page' as FlattenKeys<Q>);
	const size = api.createFieldAccessor<number>('size' as FlattenKeys<Q>);

	return (
		<PaginationBar
			class={styles.footer}
			page={page.getValue() ?? 1}
			onPageChange={async p => {
				page.setValue(p);
				await ctx.refresh();
			}}
			size={size.getValue()}
			onSizeChange={async s => {
				size.setValue(s);
				await ctx.refresh();
			}}
			sizes={ctx.pageSizes!}
			total={ctx.total}
		/>
	);
}

/**
 * 数据表上的操作工具栏
 */
export function Toolbar(props: ParentProps): JSX.Element {
	const l = useLocale();
	const ctx = useTableContext();

	return (
		<div class={styles.toolbar}>
			{props.children}
			<Show when={ctx.systemToolbar}>
				<div class={styles['system-toolbar']}>
					<Dropdown
						trigger="hover"
						items={[
							{
								type: 'item',
								value: 'hoverable',
								label: <Checkbox readonly label={l.t('_c.table.hoverable')} checked={ctx.hoverable[0]()} />,
							},
							{ type: 'divider' },
							{
								type: 'item',
								value: 'sticky-header',
								label: <Checkbox readonly label={l.t('_c.table.stickyHeader')} checked={ctx.sticky[0]()} />,
							},
							{ type: 'divider' },
							{
								type: 'item',
								value: '0',
								label: (
									<Radio
										name="striped"
										readonly
										value={0}
										checked={!ctx.striped[0]()}
										label={l.t('_c.table.noStriped')}
									/>
								),
							},
							{
								type: 'item',
								value: '2',
								label: (
									<Radio
										name="striped"
										readonly
										value={2}
										checked={ctx.striped[0]() === 2}
										label={l.t('_c.table.striped', { num: 2 })}
									/>
								),
							},
							{
								type: 'item',
								value: '3',
								label: (
									<Radio
										name="striped"
										readonly
										value={3}
										checked={ctx.striped[0]() === 3}
										label={l.t('_c.table.striped', { num: 3 })}
									/>
								),
							},
							{
								type: 'item',
								value: '4',
								label: (
									<Radio
										name="striped"
										readonly
										value={4}
										checked={ctx.striped[0]() === 4}
										label={l.t('_c.table.striped', { num: 4 })}
									/>
								),
							},
							{
								type: 'item',
								value: '5',
								label: (
									<Radio
										name="striped"
										readonly
										value={5}
										checked={ctx.striped[0]() === 5}
										label={l.t('_c.table.striped', { num: 5 })}
									/>
								),
							},
						]}
						onChange={v => {
							switch (v) {
								case 'hoverable':
									ctx.hoverable[1](!ctx.hoverable[0]());
									break;
								case 'sticky-header':
									ctx.sticky[1](!ctx.sticky[0]());
									break;
								case '0':
									ctx.striped[1](0);
									break;
								case '2':
									ctx.striped[1](2);
									break;
								case '3':
									ctx.striped[1](3);
									break;
								case '4':
									ctx.striped[1](4);
									break;
								case '5':
									ctx.striped[1](5);
									break;
							}
							return true;
						}}
					>
						<Button square rounded kind="fill" palette="tertiary">
							<IconTableRows />
						</Button>
					</Dropdown>
					<Button
						square
						rounded
						kind="fill"
						palette="tertiary"
						onclick={async () => await ctx.refresh()}
						ref={el => {
							el.root().ariaLabel = l.t('_c.refresh');
						}}
						title={l.t('_c.refresh')}
					>
						<IconRefresh />
					</Button>
					<ToggleButton.FitScreen rounded kind="fill" palette="tertiary" container={ctx.root()} />
					<PrintButton
						rounded
						kind="fill"
						palette="tertiary"
						element={() => ctx.root().querySelector('table')!}
						printClass={styles.table}
					/>
				</div>
			</Show>
		</div>
	);
}
