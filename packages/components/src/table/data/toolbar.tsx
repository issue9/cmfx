// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { type JSX, type ParentProps, Show, type Signal } from 'solid-js';
import IconRefresh from '~icons/material-symbols/refresh';
import IconTableRows from '~icons/material-symbols/table-rows-narrow';

import { Button, PrintButton, ToggleButton } from '@components/button';
import { Checkbox } from '@components/checkbox';
import { useLocale } from '@components/context';
import { Dropdown } from '@components/menu';
import { Radio } from '@components/radio';
import type { Table } from '@components/table/table';
import styles from './style.module.css';

interface ToolbarProps extends ParentProps {
	systemToolbar?: boolean;
	hoverable: Signal<boolean>;
	sticky: Signal<boolean>;
	striped: Signal<Table.RootProps['striped']>;
	root: () => HTMLElement;
	refresh: () => Promise<void>;
}

/**
 * 用于数据表上的工具
 *
 * @remarks
 * NOTE: 只能在 DataTable 之内使用。
 */
export function Toolbar(props: ToolbarProps): JSX.Element {
	const l = useLocale();

	return (
		<div class={styles.toolbar}>
			{props.children}
			<Show when={props.systemToolbar}>
				<div class={styles['system-toolbar']}>
					<Dropdown.Root
						trigger="hover"
						items={[
							{
								type: 'item',
								value: 'hoverable',
								label: <Checkbox.Root readonly label={l.t('_c.table.hoverable')} checked={props.hoverable[0]()} />,
							},
							{ type: 'divider' },
							{
								type: 'item',
								value: 'sticky-header',
								label: <Checkbox.Root readonly label={l.t('_c.table.stickyHeader')} checked={props.sticky[0]()} />,
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
										checked={!props.striped[0]()}
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
										checked={props.striped[0]() === 2}
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
										checked={props.striped[0]() === 3}
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
										checked={props.striped[0]() === 4}
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
										checked={props.striped[0]() === 5}
										label={l.t('_c.table.striped', { num: 5 })}
									/>
								),
							},
						]}
						onChange={v => {
							switch (v) {
								case 'hoverable':
									props.hoverable[1](!props.hoverable[0]());
									break;
								case 'sticky-header':
									props.sticky[1](!props.sticky[0]());
									break;
								case '0':
									props.striped[1](0);
									break;
								case '2':
									props.striped[1](2);
									break;
								case '3':
									props.striped[1](3);
									break;
								case '4':
									props.striped[1](4);
									break;
								case '5':
									props.striped[1](5);
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
						onclick={async () => await props.refresh()}
						ref={el => {
							el.root().ariaLabel = l.t('_c.refresh');
						}}
						title={l.t('_c.refresh')}
					>
						<IconRefresh />
					</Button.Root>
					<ToggleButton.FitScreen rounded kind="fill" palette="tertiary" container={props.root()} />
					<PrintButton.Root
						rounded
						kind="fill"
						palette="tertiary"
						element={() => props.root().querySelector('table')!}
						printClass={styles.table}
					/>
				</div>
			</Show>
		</div>
	);
}
