// SPDX-FileCopyrightText: 2024-2026 caixw
//
// SPDX-License-Identifier: MIT

import { Menu, MenuItem, MountProps } from '@cmfx/components';
import { createSignal, JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import IconFace from '~icons/material-symbols/face';

import { arraySelector, paletteSelector } from '@docs/components/base';
import styles from './style.module.css';

function selectedClassSelector(preset?: string) {
	return arraySelector(
		'selected class',
		new Map([
			[styles.selected, 'selected'],
			['', '空'],
		]),
		preset,
	);
}

export default function(props: MountProps): JSX.Element {
	const [Palette, palette] = paletteSelector('primary');
	const [SelectedCls, selectedCls] = selectedClassSelector(undefined);

	const items: Array<MenuItem<number>> = [
		{ type: 'item', value: 1, label: 'v1', prefix: <IconFace />, disabled: true },
		{ type: 'item', value: 2, label: 'v2' },
		{ type: 'divider' },
		{
			type: 'group',
			label: 'group',
			items: [
				{ type: 'item', value: 22, label: 'v22' },
				{ type: 'divider' },
				{
					type: 'item',
					value: 23,
					label: 'v23',
					items: [
						{ type: 'item', value: 233, label: 'v233' },
						{
							type: 'item',
							value: 234,
							label: 'v234',
							items: [
								{ type: 'item', value: 2341, label: 'v2341' },
								{ type: 'item', value: 2342, label: 'v2342' },
								{ type: 'divider' },
								{ type: 'item', value: 2343, label: 'v2343' },
							],
						},
					],
				},
			],
		},
		{ type: 'item', value: 3, label: 'v3' },
		{
			type: 'item',
			value: 4,
			label: '很长很长很长的标题-v4',
			prefix: <IconFace />,
			items: [
				{ type: 'item', value: 41, label: 'v41' },
				{ type: 'divider' },
				{
					type: 'item',
					value: 42,
					label: 'v42',
					prefix: <IconFace />,
					items: [
						{ type: 'item', value: 421, label: '很长很长很长的标题-v421' },
						{ type: 'item', value: 422, label: 'v422' },
						{ type: 'divider' },
						{ type: 'item', value: 423, label: 'v423' },
					],
				},
			],
		},
	];

	const [val, setValue] = createSignal<string>('');

	return (
		<div class="flex flex-col items-start gap-4">
			<Portal mount={props.mount}>
				<Palette />
				<SelectedCls />
			</Portal>

			<Menu
				layout="horizontal"
				selectedClass={selectedCls()}
				palette={palette()}
				items={items}
				onChange={(val, old) => {
					setValue(`new:${val}, old:${old}`);
				}}
			/>

			<Menu
				layout="vertical"
				selectedClass={selectedCls()}
				palette={palette()}
				items={items}
				onChange={(val, old) => {
					setValue(`new:${val}, old:${old}`);
				}}
			/>

			<Menu
				layout="inline"
				selectedClass={selectedCls()}
				palette={palette()}
				items={items}
				onChange={(val, old) => {
					setValue(`new:${val}, old:${old}`);
				}}
			/>

			<p>{val()}</p>
		</div>
	);
}
